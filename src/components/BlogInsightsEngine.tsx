import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Share2,
  Linkedin,
  Twitter,
  MessageSquare,
  Copy,
  Check,
  User,
  Sparkles,
  ChevronRight,
  X,
  Mail
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA, BlogPost } from '../data/firmData';

interface BlogInsightsEngineProps {
  onOpenBookingModal: (service?: string) => void;
}

export const BlogInsightsEngine: React.FC<BlogInsightsEngineProps> = ({
  onOpenBookingModal
}) => {
  const articles = JHA_ACCOUNTING_DATA.blogArticles;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Filter logic
  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = (platform: 'linkedin' | 'twitter' | 'whatsapp' | 'copy', article: BlogPost) => {
    const url = `https://jhaaccounting.com/blog/${article.slug}`;
    const text = encodeURIComponent(`${article.title} - Jha Accounting Solutions`);

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <section className="py-20 bg-[#F5F7FA] min-h-screen border-b border-slate-200/70">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-[#10B981] tracking-wider uppercase">
            Financial Insights &amp; Regulatory Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
            Corporate Accounting &amp; Statutory Compliance Knowledge Base
          </h1>
          <p className="text-base text-slate-600">
            Expert analysis on GST reconciliations, corporate TDS laws, startup runway management, and B2B back-office accounting SOPs.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['All', 'Tax Updates', 'Startup Compliance', 'Bookkeeping Guides', 'Case Studies'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0B1F3A] text-white shadow-soft-sm font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles & tax topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Category & Read time metadata (Unboxed, Zero-Pill) */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="text-emerald-700 font-bold uppercase">{article.category}</span>
                  <div className="flex items-center gap-2">
                    <span>{article.publishDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {article.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Author & Reader Trigger */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center">
                    {article.author.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{article.author.name}</p>
                    <p className="text-[10px] text-slate-500">{article.author.role}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Newsletter Signup Box */}
        <div className="bg-[#0A1128] text-white p-8 sm:p-10 rounded-2xl border border-[#1E2B52] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Statutory Alert & Regulatory Digest
            </span>
            <h3 className="text-2xl font-bold text-white">
              Subscribe to Monthly Tax & Compliance Circular Summaries
            </h3>
            <p className="text-xs text-slate-300">
              Receive concise GSTR-2B ITC updates, Income Tax section revisions, and CFO runway strategies delivered directly to your inbox. Zero spam.
            </p>
          </div>

          {!newsletterSubmitted ? (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <input
                type="email"
                required
                placeholder="Enter work email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="px-4 py-3 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-6 py-3 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                Subscribe Free
              </button>
            </form>
          ) : (
            <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold text-emerald-300">Subscription Confirmed!</span>
              <p className="text-[11px] text-slate-300">You will receive our upcoming tax circular digest.</p>
            </div>
          )}
        </div>

      </div>

      {/* Detail Article Modal Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 sm:p-10 relative overflow-hidden my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Modal */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-8">
              
              {/* Article Header */}
              <div className="space-y-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="text-emerald-700 font-bold uppercase">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.publishDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.readTime}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {activeArticle.title}
                </h1>

                {/* Author Card & One-Click Social Share */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-dark text-emerald-400 font-bold font-mono text-sm flex items-center justify-center">
                      {activeArticle.author.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{activeArticle.author.name}</p>
                      <p className="text-[11px] text-slate-500">{activeArticle.author.role}</p>
                    </div>
                  </div>

                  {/* Native Social Share Buttons */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono text-[10px]">Share Article:</span>
                    <button
                      onClick={() => handleShare('linkedin', activeArticle)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter', activeArticle)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Share on X / Twitter"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp', activeArticle)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => handleShare('copy', activeArticle)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative"
                      title="Copy Article Link"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Sticky Table of Contents + Main Body Content */}
              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Sticky TOC Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 sticky top-4 space-y-3">
                    <span className="text-xs font-mono font-bold text-slate-900 block uppercase">
                      Table of Contents
                    </span>
                    <ul className="space-y-2 text-xs">
                      {activeArticle.toc.map(item => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="text-slate-600 hover:text-emerald-700 transition-colors block py-0.5"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setActiveArticle(null);
                          onOpenBookingModal();
                        }}
                        className="w-full py-2 px-3 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors text-center shadow-xs"
                      >
                        Request Advisory Consultation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="lg:col-span-8 space-y-8 text-slate-700 text-sm leading-relaxed">
                  
                  {activeArticle.content.map(sec => (
                    <div key={sec.sectionId} id={sec.sectionId} className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                        {sec.heading}
                      </h3>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-xs sm:text-sm text-slate-600">
                          {p}
                        </p>
                      ))}
                    </div>
                  ))}

                  {/* Key Takeaway Box */}
                  <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-200 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">
                      Key Financial Executive Takeaway:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      {activeArticle.keyTakeaway}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};
