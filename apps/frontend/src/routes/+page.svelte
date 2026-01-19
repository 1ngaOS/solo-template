<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
	<title>Solo Monorepo Template</title>
	<meta name="description" content="A production-ready monorepo template for solo projects" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex justify-between items-center">
				<h1 class="text-2xl font-bold text-gray-900">Solo Template</h1>
				<nav class="flex space-x-6">
					<a href="/" class="text-gray-600 hover:text-gray-900">Home</a>
					<a href="#features" class="text-gray-600 hover:text-gray-900">Features</a>
					<a href="#docs" class="text-gray-600 hover:text-gray-900">Documentation</a>
				</nav>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center mb-16">
			<h2 class="text-5xl font-bold text-gray-900 mb-6">
				Solo Monorepo Template
			</h2>
			<p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
				A production-ready monorepo template for solo projects featuring backend, frontend, and documentation components.
			</p>
			<div class="flex justify-center space-x-4">
				<a
					href="https://github.com"
					class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
				>
					Get Started
				</a>
				<a
					href="#docs"
					class="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
				>
					Documentation
				</a>
			</div>
		</div>

		<!-- Features Section -->
		<section id="features" class="mb-16">
			<h3 class="text-3xl font-bold text-center text-gray-900 mb-12">Features</h3>
			<div class="grid md:grid-cols-3 gap-8">
				<div class="bg-white p-6 rounded-xl shadow-md">
					<div class="text-blue-600 text-4xl mb-4">🚀</div>
					<h4 class="text-xl font-semibold mb-2">Fast Backend</h4>
					<p class="text-gray-600">
						Rust-based API server with Axum framework for high performance and reliability.
					</p>
				</div>
				<div class="bg-white p-6 rounded-xl shadow-md">
					<div class="text-purple-600 text-4xl mb-4">⚡</div>
					<h4 class="text-xl font-semibold mb-2">Modern Frontend</h4>
					<p class="text-gray-600">
						SvelteKit with server-side rendering and Tailwind CSS v4 for beautiful UIs.
					</p>
				</div>
				<div class="bg-white p-6 rounded-xl shadow-md">
					<div class="text-green-600 text-4xl mb-4">📚</div>
					<h4 class="text-xl font-semibold mb-2">Comprehensive Docs</h4>
					<p class="text-gray-600">
						Docusaurus documentation site with API reference and guides.
					</p>
				</div>
			</div>
		</section>

		<!-- Tech Stack Section -->
		<section id="tech-stack" class="mb-16">
			<h3 class="text-3xl font-bold text-center text-gray-900 mb-12">Technology Stack</h3>
			<div class="bg-white rounded-xl shadow-md p-8">
				<div class="grid md:grid-cols-2 gap-6">
					<div>
						<h4 class="font-semibold text-lg mb-3">Backend</h4>
						<ul class="space-y-2 text-gray-600">
							<li>• Rust with Axum framework</li>
							<li>• RESTful API endpoints</li>
							<li>• CORS and tracing support</li>
							<li>• Health check endpoints</li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold text-lg mb-3">Frontend</h4>
						<ul class="space-y-2 text-gray-600">
							<li>• SvelteKit with server-side rendering</li>
							<li>• Tailwind CSS v4</li>
							<li>• TypeScript support</li>
							<li>• SEO optimized</li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold text-lg mb-3">Documentation</h4>
						<ul class="space-y-2 text-gray-600">
							<li>• Docusaurus framework</li>
							<li>• Markdown-based content</li>
							<li>• API documentation</li>
							<li>• Search functionality</li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold text-lg mb-3">Tools</h4>
						<ul class="space-y-2 text-gray-600">
							<li>• pnpm for package management</li>
							<li>• Docker & Docker Compose</li>
							<li>• GitHub Actions CI/CD</li>
							<li>• Makefile for development</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- Quick Start Section -->
		<section id="quick-start" class="mb-16">
			<h3 class="text-3xl font-bold text-center text-gray-900 mb-8">Quick Start</h3>
			<div class="bg-gray-900 rounded-xl p-6 text-gray-100 font-mono text-sm overflow-x-auto">
				<pre><code># Install dependencies
pnpm install

# Start all services
make up

# Or start individually
make frontend-dev
make backend-dev
make docs-dev</code></pre>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="bg-gray-900 text-gray-300 py-8 mt-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<p>&copy; 2024 Solo Monorepo Template. Licensed under MIT.</p>
			</div>
		</div>
	</footer>
</div>

