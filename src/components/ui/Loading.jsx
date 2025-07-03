import React from 'react';

const Loading = ({ type = 'products' }) => {
  if (type === 'product-detail') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="bg-surface rounded-lg h-96 animate-pulse"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface rounded h-20 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="bg-surface rounded h-8 animate-pulse"></div>
              <div className="bg-surface rounded h-6 w-2/3 animate-pulse"></div>
            </div>
            <div className="bg-surface rounded h-4 w-1/4 animate-pulse"></div>
            
            <div className="space-y-3">
              <div className="bg-surface rounded h-4 animate-pulse"></div>
              <div className="bg-surface rounded h-4 w-4/5 animate-pulse"></div>
              <div className="bg-surface rounded h-4 w-3/4 animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-surface rounded h-6 w-1/3 animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-surface rounded h-10 animate-pulse"></div>
                ))}
              </div>
            </div>
            
            <div className="bg-surface rounded h-12 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'checkout') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface rounded h-8 w-1/3 animate-pulse mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface rounded-lg p-6 space-y-4">
                  <div className="bg-gray-300 rounded h-6 w-1/3 animate-pulse"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="bg-gray-300 rounded h-10 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-surface rounded-lg p-6 space-y-4 h-fit">
              <div className="bg-gray-300 rounded h-6 w-1/2 animate-pulse"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="bg-gray-300 rounded h-4 w-1/3 animate-pulse"></div>
                  <div className="bg-gray-300 rounded h-4 w-1/4 animate-pulse"></div>
                </div>
              ))}
              <div className="bg-gray-300 rounded h-12 animate-pulse mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default products grid skeleton
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="group">
            <div className="bg-surface rounded-lg overflow-hidden">
              <div className="bg-gray-300 w-full h-64 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-300 rounded h-4 w-3/4 animate-pulse"></div>
                <div className="bg-gray-300 rounded h-4 w-1/2 animate-pulse"></div>
                <div className="bg-gray-300 rounded h-8 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;