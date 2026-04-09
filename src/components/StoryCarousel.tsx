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
    <section className="mb-3">
      <div className="flex gap-2 overflow-x-auto py-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`min-w-[100px] px-3 py-1.5 rounded-md text-xs border ${currentStage === item.id ? 'border-orange-500 bg-yellow-50' : 'border-gray-200 bg-white'}`}
          >
            <div className={`font-medium ${currentStage === item.id ? 'text-orange-700' : 'text-gray-600'}`}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoryCarousel;
