"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 font-sans">
      {/* Header/Navbar */}
      <header className="w-full flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-700 tracking-tight">Gloria Connect</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login" className="text-blue-700 hover:underline font-medium">Login</Link>
          <Link href="/register" className="text-blue-700 hover:underline font-medium">Register</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          Welcome to <span className="text-blue-700">Gloria Connect</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Effortlessly connect, collaborate, and grow your community with our modern, secure platform.
        </p>
        <Link href="/register">
          <button className="bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg font-semibold text-lg hover:bg-blue-800 transition">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          <h3 className="font-bold text-xl mb-2">Easy Collaboration</h3>
          <p className="text-gray-500">Work together in real time with seamless messaging and file sharing.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9-5-9-5-9 5 9 5z" /></svg>
          <h3 className="font-bold text-xl mb-2">Secure & Private</h3>
          <p className="text-gray-500">Your data is protected with industry-leading security and privacy controls.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" /></svg>
          <h3 className="font-bold text-xl mb-2">Grow Your Network</h3>
          <p className="text-gray-500">Find and connect with like-minded people and expand your reach.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to join the community?</h2>
        <Link href="/register">
          <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-50 transition">
            Create Your Account
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm bg-white border-t mt-8">
        &copy; {new Date().getFullYear()} Gloria Connect. All rights reserved.
      </footer>
    </main>
  );
}
