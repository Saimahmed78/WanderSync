import { RefreshCw, BarChart3, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: RefreshCw,
    title: 'Real-Time Sync',
    description: 'Stay updated with instant synchronization across all your devices and team members.',
  },
  {
    icon: BarChart3,
    title: 'Automated Reporting',
    description: 'Generate comprehensive reports automatically and track progress effortlessly.',
  },
  {
    icon: Users,
    title: 'Seamless Collaboration',
    description: 'Work together in real-time with powerful tools designed for modern teams.',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'Your data is protected with bank-level encryption and security standards.',
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-100 mb-4">Built for Modern Teams</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage projects efficiently and scale your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 ring-1 ring-gray-700 hover:ring-indigo-600/50 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-500" />
              </div>
              
              {/* Content */}
              <h3 className="text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
