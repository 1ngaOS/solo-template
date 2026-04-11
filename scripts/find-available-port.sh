#!/usr/bin/env bash
#
# find-available-port.sh - Find available ports for new app deployments
# 
# This script scans the VM for running systemd services matching the naming
# convention {appname}-{env}-{frontend|backend}.service and determines which
# ports are in use, then suggests available ports for new deployments.
#
# Usage: ./find-available-port.sh [app-name] [environment] [component]
#   app-name   : Optional app name to filter (default: scan all apps)
#   environment: Optional environment (staging|production, default: both)
#   component  : Optional component (frontend|backend, default: both)
#
# Example:
#   ./find-available-port.sh                    # Scan all services
#   ./find-available-port.sh myapp staging      # Find port for myapp-staging
#   ./find-available-port.sh myapp production backend  # Find backend port for myapp-production
#

set -euo pipefail

# Default port ranges (configurable via environment variables)
FRONTEND_STAGING_PORT_START=${FRONTEND_STAGING_PORT_START:-6200}
FRONTEND_STAGING_PORT_END=${FRONTEND_STAGING_PORT_END:-6299}
FRONTEND_PRODUCTION_PORT_START=${FRONTEND_PRODUCTION_PORT_START:-6400}
FRONTEND_PRODUCTION_PORT_END=${FRONTEND_PRODUCTION_PORT_END:-6499}
BACKEND_STAGING_PORT_START=${BACKEND_STAGING_PORT_START:-6100}
BACKEND_STAGING_PORT_END=${BACKEND_STAGING_PORT_END:-6199}
BACKEND_PRODUCTION_PORT_START=${BACKEND_PRODUCTION_PORT_START:-6300}
BACKEND_PRODUCTION_PORT_END=${BACKEND_PRODUCTION_PORT_END:-6399}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if a port is in use
is_port_in_use() {
    local port=$1
    ss -tlnp | grep -q ":${port} " 2>/dev/null || netstat -tlnp 2>/dev/null | grep -q ":${port} "
}

# Get port from systemd service file
get_service_port() {
    local service_file=$1
    local port=""
    
    # Try to extract PORT from Environment= lines
    port=$(grep -E "^Environment=PORT=" "$service_file" 2>/dev/null | head -1 | cut -d'=' -f2)
    
    if [ -z "$port" ]; then
        # Try to extract from ExecStart with --port flag
        port=$(grep -E "^ExecStart=.*--port" "$service_file" 2>/dev/null | head -1 | grep -oE '\-\-port[[:space:]]*[0-9]+' | grep -oE '[0-9]+')
    fi
    
    echo "$port"
}

# Main function
main() {
    local filter_app="${1:-}"
    local filter_env="${2:-}"
    local filter_component="${3:-}"
    
    print_info "Scanning for running services with naming convention: {appname}-{env}-{frontend|backend}.service"
    echo ""
    
    # Arrays to track used ports
    declare -A used_ports
    declare -a running_services
    
    # Find all matching service files
    local service_files=()
    if [ -d "/etc/systemd/system" ]; then
        while IFS= read -r -d '' file; do
            service_files+=("$file")
        done < <(find /etc/systemd/system -name "*.service" -print0 2>/dev/null)
    fi
    
    # Also check /lib/systemd/system for installed services
    if [ -d "/lib/systemd/system" ]; then
        while IFS= read -r -d '' file; do
            # Avoid duplicates
            local basename=$(basename "$file")
            local already_added=false
            for sf in "${service_files[@]}"; do
                if [ "$(basename "$sf")" = "$basename" ]; then
                    already_added=true
                    break
                fi
            done
            if [ "$already_added" = false ]; then
                service_files+=("$file")
            fi
        done < <(find /lib/systemd/system -name "*.service" -print0 2>/dev/null)
    fi
    
    print_info "Found ${#service_files[@]} service files to analyze"
    echo ""
    
    # Pattern: {appname}-{env}-{frontend|backend}.service
    # Examples: myapp-staging-frontend.service, solo-template-production-backend.service
    local pattern='^([a-zA-Z0-9_-]+)-(staging|production)-(frontend|backend)\.service$'
    
    echo "=========================================="
    echo "Running Services (matching pattern)"
    echo "=========================================="
    printf "%-50s %-15s %-12s %-10s\n" "SERVICE" "STATUS" "PORT" "ENV"
    echo "------------------------------------------"
    
    for service_file in "${service_files[@]}"; do
        local filename=$(basename "$service_file")
        
        # Match the naming pattern
        if [[ $filename =~ $pattern ]]; then
            local app_name="${BASH_REMATCH[1]}"
            local env="${BASH_REMATCH[2]}"
            local component="${BASH_REMATCH[3]}"
            
            # Apply filters
            if [ -n "$filter_app" ] && [ "$app_name" != "$filter_app" ]; then
                continue
            fi
            if [ -n "$filter_env" ] && [ "$env" != "$filter_env" ]; then
                continue
            fi
            if [ -n "$filter_component" ] && [ "$component" != "$filter_component" ]; then
                continue
            fi
            
            local service_name="${filename%.service}"
            local status="inactive"
            local port="N/A"
            
            # Check if service is active
            if systemctl is-active --quiet "$service_name" 2>/dev/null; then
                status="active"
            elif systemctl is-enabled --quiet "$service_name" 2>/dev/null; then
                status="enabled"
            fi
            
            # Try to get port from service file
            port=$(get_service_port "$service_file")
            
            if [ -n "$port" ]; then
                used_ports["$port"]="$service_name"
                
                # Verify if port is actually in use
                if is_port_in_use "$port"; then
                    print_success "Found: $service_name (Port: $port, Status: $status)"
                    printf "%-50s %-15s %-12s %-10s\n" "$service_name" "$status" "$port" "$env"
                else
                    print_warning "Service $service_name configured for port $port but not listening"
                    printf "%-50s %-15s %-12s %-10s\n" "$service_name" "$status" "$port (not listening)" "$env"
                fi
            else
                printf "%-50s %-15s %-12s %-10s\n" "$service_name" "$status" "N/A" "$env"
            fi
            
            running_services+=("$service_name")
        fi
    done
    
    echo ""
    echo "=========================================="
    echo "Port Usage Summary"
    echo "=========================================="
    
    if [ ${#used_ports[@]} -eq 0 ]; then
        print_info "No matching services found with configured ports."
    else
        echo "Used ports: ${!used_ports[@]}" | tr ' ' '\n' | sort -n | tr '\n' ' '
        echo ""
        echo ""
    fi
    
    # Suggest available ports based on filters or show all ranges
    echo "=========================================="
    echo "Available Port Recommendations"
    echo "=========================================="
    
    local suggest_env="${filter_env:-both}"
    local suggest_component="${filter_component:-both}"
    
    if [ "$suggest_component" = "both" ] || [ "$suggest_component" = "frontend" ]; then
        if [ "$suggest_env" = "both" ] || [ "$suggest_env" = "staging" ]; then
            echo ""
            echo "Frontend Staging Ports (${FRONTEND_STAGING_PORT_START}-${FRONTEND_STAGING_PORT_END}):"
            local found=false
            for ((port=FRONTEND_STAGING_PORT_START; port<=FRONTEND_STAGING_PORT_END; port++)); do
                if [ -z "${used_ports[$port]:-}" ] && ! is_port_in_use "$port"; then
                    if [ "$found" = false ]; then
                        print_success "  Available: $port"
                        found=true
                    else
                        echo "               $port"
                    fi
                    # Show first 5 available ports
                    if [ "$(echo "$found" | wc -l)" -ge 5 ]; then
                        break
                    fi
                fi
            done
            if [ "$found" = false ]; then
                print_warning "  No available ports in range ${FRONTEND_STAGING_PORT_START}-${FRONTEND_STAGING_PORT_END}"
            fi
        fi
        
        if [ "$suggest_env" = "both" ] || [ "$suggest_env" = "production" ]; then
            echo ""
            echo "Frontend Production Ports (${FRONTEND_PRODUCTION_PORT_START}-${FRONTEND_PRODUCTION_PORT_END}):"
            local found=false
            for ((port=FRONTEND_PRODUCTION_PORT_START; port<=FRONTEND_PRODUCTION_PORT_END; port++)); do
                if [ -z "${used_ports[$port]:-}" ] && ! is_port_in_use "$port"; then
                    if [ "$found" = false ]; then
                        print_success "  Available: $port"
                        found=true
                    else
                        echo "               $port"
                    fi
                    if [ "$(echo "$found" | wc -l)" -ge 5 ]; then
                        break
                    fi
                fi
            done
            if [ "$found" = false ]; then
                print_warning "  No available ports in range ${FRONTEND_PRODUCTION_PORT_START}-${FRONTEND_PRODUCTION_PORT_END}"
            fi
        fi
    fi
    
    if [ "$suggest_component" = "both" ] || [ "$suggest_component" = "backend" ]; then
        if [ "$suggest_env" = "both" ] || [ "$suggest_env" = "staging" ]; then
            echo ""
            echo "Backend Staging Ports (${BACKEND_STAGING_PORT_START}-${BACKEND_STAGING_PORT_END}):"
            local found=false
            for ((port=BACKEND_STAGING_PORT_START; port<=BACKEND_STAGING_PORT_END; port++)); do
                if [ -z "${used_ports[$port]:-}" ] && ! is_port_in_use "$port"; then
                    if [ "$found" = false ]; then
                        print_success "  Available: $port"
                        found=true
                    else
                        echo "               $port"
                    fi
                    if [ "$(echo "$found" | wc -l)" -ge 5 ]; then
                        break
                    fi
                fi
            done
            if [ "$found" = false ]; then
                print_warning "  No available ports in range ${BACKEND_STAGING_PORT_START}-${BACKEND_STAGING_PORT_END}"
            fi
        fi
        
        if [ "$suggest_env" = "both" ] || [ "$suggest_env" = "production" ]; then
            echo ""
            echo "Backend Production Ports (${BACKEND_PRODUCTION_PORT_START}-${BACKEND_PRODUCTION_PORT_END}):"
            local found=false
            for ((port=BACKEND_PRODUCTION_PORT_START; port<=BACKEND_PRODUCTION_PORT_END; port++)); do
                if [ -z "${used_ports[$port]:-}" ] && ! is_port_in_use "$port"; then
                    if [ "$found" = false ]; then
                        print_success "  Available: $port"
                        found=true
                    else
                        echo "               $port"
                    fi
                    if [ "$(echo "$found" | wc -l)" -ge 5 ]; then
                        break
                    fi
                fi
            done
            if [ "$found" = false ]; then
                print_warning "  No available ports in range ${BACKEND_PRODUCTION_PORT_START}-${BACKEND_PRODUCTION_PORT_END}"
            fi
        fi
    fi
    
    echo ""
    echo "=========================================="
    echo "Usage Examples"
    echo "=========================================="
    echo "To deploy a new app, update template.config.yaml with:"
    echo "  deployment:"
    echo "    frontendStagingPort: <selected_port>"
    echo "    frontendProductionPort: <selected_port>"
    echo "    backendStagingPort: <selected_port>"
    echo "    backendProductionPort: <selected_port>"
    echo ""
    echo "Then run: pnpm run apply-template"
    echo ""
}

main "$@"
