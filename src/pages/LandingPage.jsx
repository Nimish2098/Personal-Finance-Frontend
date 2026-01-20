import { motion } from 'motion/react';
import { Wallet, TrendingUp, Shield, Zap, PieChart, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: 'Track Your Money',
      description: 'Monitor income and expenses in real-time with beautiful visualizations'
    },
    {
      icon: PieChart,
      title: 'Smart Analytics',
      description: 'Get instant insights into your spending habits with interactive charts'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Add transactions in seconds with our streamlined interface'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data stays safe with local storage'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Add Transactions',
      description: 'Quickly log your income and expenses with just a few clicks'
    },
    {
      number: '02',
      title: 'Categorize',
      description: 'Organize your finances with smart category management'
    },
    {
      number: '03',
      title: 'Analyze',
      description: 'View detailed breakdowns and track your financial health'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-800">Finance Tracker</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </motion.button>
          </motion.header>

          {/* Hero Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Modern Finance Management</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                Take Control of Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Track expenses, monitor income, and gain insights into your spending habits with our beautifully simple finance tracker.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')} // Demo points to login for now
                  className="px-8 py-4 bg-white text-slate-700 rounded-xl shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all"
                >
                  View Demo
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-300/50 p-8">
                <div className="space-y-4">
                  {/* Mock Dashboard Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700">Income</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">$5,420</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                        <span className="text-xs text-red-700">Expenses</span>
                      </div>
                      <p className="text-2xl font-bold text-red-500">$3,210</p>
                    </div>
                  </div>

                  {/* Mock Transactions */}
                  <div className="space-y-3 pt-4">
                    {[
                      { name: 'Salary', amount: '+$4,200', color: 'green' },
                      { name: 'Shopping', amount: '-$156', color: 'red' },
                      { name: 'Food & Dining', amount: '-$89', color: 'red' }
                    ].map((transaction, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${transaction.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                            }`} />
                          <span className="text-sm font-medium text-slate-700">{transaction.name}</span>
                        </div>
                        <span className={`font-bold ${transaction.color === 'green' ? 'text-green-600' : 'text-red-500'
                          }`}>
                          {transaction.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30"
              />
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-slate-600">
                Powerful features to help you manage your finances effortlessly
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-slate-600">
                Start managing your finances in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-6">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-600">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl shadow-blue-500/30"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already taking control of their financial future
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 mx-auto"
            >
              Start Tracking Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-700">Finance Tracker</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2026 Finance Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
