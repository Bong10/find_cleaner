// components/job-categories/CategoryIcons.jsx
'use client'; // This component uses event handlers, so it must be a client component.

import { useRouter } from 'next/navigation';

export default function CategoryIcons() {
  const router = useRouter();

  const categories = [
    { id: 1, name: 'Domestic', icon: '/images/icons/domestic.png', color: '#9B2C47' },
    { id: 2, name: 'Commercial', icon: '/images/icons/commercial.png', color: '#2563EB' },
    { id: 3, name: 'Biohazard', icon: '/images/icons/biohazard.png', color: '#10B981' },
    { id: 4, name: 'Carpet and Floor', icon: '/images/icons/CarpetandFloor.png', color: '#9B2C47' },
    { id: 5, name: 'Construction', icon: '/images/icons/construction.png', color: '#F59E0B' }
  ];

  const handleClick = (name) => {
    // Navigate to Find Cleaners pre-filtered by the selected service
    const service = encodeURIComponent(name);
    router.push(`/cleaners?service=${service}`);
  };

  return (
    <>
      <div className="category-section">
        <div className="category-container">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className="category-item"
              onClick={() => handleClick(cat.name)}
              aria-label={`View cleaners for ${cat.name}`}
            >
              <div className="category-icon" style={{ backgroundColor: `${cat.color}20` }}>
                <img src={cat.icon} alt={cat.name} />
              </div>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-section {
          background: #FFFFFF;
          padding: 1.5rem 0;
        }
        
        .category-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: center;
          gap: 2.5rem;
        }
        
        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
        }
        
        .category-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          padding: 14px;
        }
        
        .category-icon img {
          width: 28px;
          height: 28px;
          object-fit: contain;
        }
        
        .category-item:hover .category-icon {
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .category-name {
          font-size: 0.8125rem;
          color: #111827;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .category-section {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .category-container {
            justify-content: flex-start;
            padding: 0 1rem;
            gap: 1.25rem;
            width: max-content;
          }
          .category-item {
            min-width: 65px;
          }
          .category-icon {
            width: 50px;
            height: 50px;
            padding: 12px;
          }
          .category-icon img {
            width: 26px;
            height: 26px;
          }
          .category-name {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}