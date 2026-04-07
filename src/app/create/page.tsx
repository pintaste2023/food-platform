// AI Generation Flow - Main Entry
import { Suspense } from 'react';
import CreateContent from './CreateContent';

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <p className="text-gray-500">載入中...</p>
      </div>
    }>
      <CreateContent />
    </Suspense>
  );
}