import { useState } from 'react';

const DiscountSection = ({ onApplyDiscount, currentDiscount, originalPrice }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');

  const handleApplyDiscount = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    setError('');
    
    try {
      await onApplyDiscount(couponCode);
      setCouponCode('');
    } catch (err) {
      setError(err.message || 'Invalid coupon code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveDiscount = () => {
    onApplyDiscount(null);
    setCouponCode('');
    setError('');
  };

  const discountedPrice = currentDiscount 
    ? originalPrice - (originalPrice * currentDiscount.percentage / 100)
    : originalPrice;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💰 Discount Codes
      </h3>

      {currentDiscount ? (
        <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-green-800">
                🎉 {currentDiscount.code} Applied!
              </div>
              <div className="text-sm text-green-600">
                {currentDiscount.percentage}% off - Save ${(originalPrice - discountedPrice).toFixed(2)}
              </div>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleApplyDiscount}
              disabled={!couponCode.trim() || isApplying}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>
      )}

      {/* Sample Codes */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Try these sample codes:</div>
        <div className="flex flex-wrap gap-2">
          {['SAVE10', 'WELCOME20', 'FIRST15'].map(code => (
            <button
              key={code}
              onClick={() => setCouponCode(code)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Original Price:</span>
          <span className={currentDiscount ? 'line-through text-gray-500' : 'font-semibold'}>
            ${originalPrice}
          </span>
        </div>
        {currentDiscount && (
          <div className="flex justify-between items-center text-green-600 font-semibold">
            <span>Discounted Price:</span>
            <span>${discountedPrice.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountSection;