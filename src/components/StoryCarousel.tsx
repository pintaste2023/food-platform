import React from 'react';

type Props = {
  currentStage: number;
};

const StoryCarousel: React.FC<Props> = ({ currentStage }) => {
  const items = [
    { id: 1, label: 'Stage 1: Tutorial' },
    { id: 2, label: 'Stage 2: Create' },
    { id: 3, label: 'Stage 3: Result' },
    { id: 4, label: 'Stage 4: Home' },
    { id: 5, label: 'Stage 5: Earnings' },
  ];

  return (
    <section className="mb-6">
      <div className="flex gap-4 overflow-x-auto py-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`min-w-[140px] p-4 rounded-lg border ${currentStage === item.id ? 'border-orange-500 bg-yellow-50' : 'border-gray-200 bg-white'}`}
          >
            <div className={`text-sm font-semibold ${currentStage === item.id ? 'text-orange-700' : 'text-gray-700'}`}>
              {item.label}
            </div>
            {currentStage === item.id && (
              <div className="mt-2 text-xs text-orange-600">Current</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoryCarousel;
