import React from 'react';
import Navbar from './Navbar';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Cookie Statement
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Last updated: December 27, 2023
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-3xl prose prose-blue">
          <h2>About Cookies and Similar Technologies</h2>
          <p>
            A cookie is a small text file that a website places on your computer or device when you visit a site. 
            We use cookies and similar technologies like web beacons, pixel tags, or local shared objects to deliver, 
            measure, and improve our services in various ways.
          </p>

          <h2>What We Use Cookies For</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Essential Website Cookies</h3>
              <p>
                These cookies are strictly necessary for the website to function. They enable core functionality 
                such as security, network management, and accessibility. You may disable these by changing your 
                browser settings, but this may affect how the website functions.
              </p>
              <ul className="list-disc pl-6">
                <li>Authentication and security</li>
                <li>Session management</li>
                <li>Load balancing</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Analytics and Performance Cookies</h3>
              <p>
                These cookies allow us to count visits and traffic sources so we can measure and improve the 
                performance of our site. They help us to know which pages are the most and least popular and 
                see how visitors move around the site.
              </p>
              <ul className="list-disc pl-6">
                <li>Google Analytics</li>
                <li>Performance monitoring</li>
                <li>Error logging</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Functional Cookies</h3>
              <p>
                These cookies enable enhanced functionality and personalization. They may be set by us or by 
                third-party providers whose services we have added to our pages.
              </p>
              <ul className="list-disc pl-6">
                <li>Theme preferences</li>
                <li>Language settings</li>
                <li>Alert configurations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Targeting and Advertising Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising partners. They may be used by 
                those companies to build a profile of your interests and show you relevant adverts on other sites.
              </p>
              <ul className="list-disc pl-6">
                <li>Marketing analytics</li>
                <li>Conversion tracking</li>
                <li>Behavioral advertising</li>
              </ul>
            </div>
          </div>

          <h2 className="mt-8">Cookie Management</h2>
          <p>
            Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse 
            cookies, or delete certain cookies. Generally you also have the ability to manage similar technologies 
            in the same way that you manage cookies – using your browsers preferences.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-6">
            <h3 className="font-semibold">The following links show how to adjust your browser settings:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            </ul>
          </div>

          <h2 className="mt-8">Third-Party Services</h2>
          <p>
            We use various third-party services to enhance our platform's functionality. These services may use 
            cookies and similar tracking technologies:
          </p>
          <ul className="list-disc pl-6">
            <li>Stripe - Payment processing</li>
            <li>Google Analytics - Usage analytics</li>
            <li>Authentication providers</li>
          </ul>

          <h2 className="mt-8">Updates to This Cookie Statement</h2>
          <p>
            We may update this Cookie Statement from time to time to reflect changes in technology, legislation, 
            our operations, or as we otherwise determine is necessary or appropriate. Any such changes will become 
            effective when we make the revised statement available on our website.
          </p>

          <h2 className="mt-8">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Statement, please contact us at{' '}
            <a href="mailto:support@tradingalerts.com" className="text-primary-600 hover:text-primary-500">
              support@tradingalerts.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
