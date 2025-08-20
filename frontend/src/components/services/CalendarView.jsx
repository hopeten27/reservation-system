import { useState } from 'react';

const CalendarView = ({ slots, onSlotSelect, selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getSlotsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return slots.filter(slot => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === dateStr && slot.capacity > slot.bookedCount;
    });
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const slotsForDate = getSlotsForDate(date);
          const hasSlots = slotsForDate.length > 0;
          
          return (
            <div
              key={index}
              className={`
                p-2 h-16 border border-gray-100 cursor-pointer transition-colors
                ${!date ? 'cursor-default' : ''}
                ${isPast(date) ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}
                ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}
                ${isSelected(date) ? 'bg-blue-100 border-blue-300' : ''}
                ${hasSlots && !isPast(date) ? 'hover:bg-green-50' : ''}
              `}
              onClick={() => {
                if (date && !isPast(date)) {
                  onDateChange(date);
                }
              }}
            >
              {date && (
                <div className="text-center">
                  <div className={`text-sm ${isSelected(date) ? 'font-bold' : ''}`}>
                    {date.getDate()}
                  </div>
                  {hasSlots && !isPast(date) && (
                    <div className="text-xs text-green-600 font-medium">
                      {slotsForDate.length} slots
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">
            Available Times - {selectedDate.toLocaleDateString()}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {getSlotsForDate(selectedDate).map(slot => (
              <button
                key={slot._id}
                onClick={() => onSlotSelect(slot)}
                className="p-3 text-sm border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-medium">
                  {new Date(slot.date).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {slot.capacity - slot.bookedCount} spots left
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;