import React, { useState, useRef, useEffect } from 'react';
import { LuCalendar as Calendar, LuChevronDown as ChevronDown, LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight, LuClock as Clock } from 'react-icons/lu';
import SleekDropdown from '../../../components/ui/SleekDropdown';

export { default as SleekDropdown } from '../../../components/ui/SleekDropdown';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses', dotColor: 'bg-primary-500' },
  { value: 'PENDING', label: 'Pending', dotColor: 'bg-yellow-500' },
  { value: 'CONFIRMED', label: 'Confirmed', dotColor: 'bg-blue-500' },
  { value: 'PROCESSING', label: 'Processing', dotColor: 'bg-purple-500' },
  { value: 'DELIVERED', label: 'Delivered', dotColor: 'bg-green-500' },
  { value: 'CANCELLED', label: 'Cancelled', dotColor: 'bg-red-500' },
];

export const StatusSelector = ({ selectedStatus, onChange }) => (
  <SleekDropdown
    headerTitle="Filter by Status"
    options={STATUS_OPTIONS}
    value={selectedStatus}
    onChange={onChange}
    widthClass="w-44"
  />
);

const TIME_MODE_OPTIONS = [
  { value: 'ALL', label: 'All Time' },
  { value: 'YEAR', label: 'By Year' },
  { value: 'MONTH', label: 'By Year & Month' },
];

export const TimeModeSelector = ({ selectedMode, onChange }) => (
  <SleekDropdown
    icon={Clock}
    headerTitle="Time Period"
    options={TIME_MODE_OPTIONS}
    value={selectedMode}
    onChange={onChange}
    widthClass="w-40"
  />
);

export const YearSelector = ({ selectedYear, onChange }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = React.useMemo(() => {
    const list = [];
    for (let y = currentYear + 1; y >= 2015; y--) {
      list.push({ value: String(y), label: String(y) });
    }
    return list;
  }, [currentYear]);

  return (
    <SleekDropdown
      icon={Calendar}
      headerTitle="Scroll Year"
      options={yearOptions}
      value={selectedYear || String(currentYear)}
      onChange={onChange}
      widthClass="w-32"
      maxHeightClass="max-h-48"
    />
  );
};

const MONTH_NAMES = [
  { name: 'Jan', full: 'January', val: '01' },
  { name: 'Feb', full: 'February', val: '02' },
  { name: 'Mar', full: 'March', val: '03' },
  { name: 'Apr', full: 'April', val: '04' },
  { name: 'May', full: 'May', val: '05' },
  { name: 'Jun', full: 'June', val: '06' },
  { name: 'Jul', full: 'July', val: '07' },
  { name: 'Aug', full: 'August', val: '08' },
  { name: 'Sep', full: 'September', val: '09' },
  { name: 'Oct', full: 'October', val: '10' },
  { name: 'Nov', full: 'November', val: '11' },
  { name: 'Dec', full: 'December', val: '12' },
];

export const YearMonthSelector = ({ selectedYearMonth, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearList, setShowYearList] = useState(false);
  const dropdownRef = useRef(null);

  const initialYear = selectedYearMonth ? selectedYearMonth.split('-')[0] : String(new Date().getFullYear());
  const initialMonthVal = selectedYearMonth ? selectedYearMonth.split('-')[1] : String(new Date().getMonth() + 1).padStart(2, '0');

  const [activeYear, setActiveYear] = useState(Number(initialYear));
  const [activeMonthVal, setActiveMonthVal] = useState(initialMonthVal);

  const currentYear = new Date().getFullYear();
  const years = React.useMemo(() => {
    const list = [];
    for (let y = currentYear + 1; y >= 2015; y--) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  useEffect(() => {
    if (selectedYearMonth) {
      const [y, m] = selectedYearMonth.split('-');
      if (y) setActiveYear(Number(y));
      if (m) setActiveMonthVal(m);
    }
  }, [selectedYearMonth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowYearList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMonthSelect = (monthVal) => {
    setActiveMonthVal(monthVal);
    onChange(`${activeYear}-${monthVal}`);
    setIsOpen(false);
    setShowYearList(false);
  };

  const getDisplayLabel = () => {
    if (!selectedYearMonth) {
      const currentM = MONTH_NAMES[new Date().getMonth()].full;
      return `${currentM} ${currentYear}`;
    }
    const [y, m] = selectedYearMonth.split('-');
    const monthObj = MONTH_NAMES.find((item) => item.val === m);
    return `${monthObj ? monthObj.full : ''} ${y}`;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowYearList(false);
        }}
        className="flex items-center gap-2 bg-background border border-border rounded-xl px-3.5 py-1.5 text-xs font-bold text-foreground hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
      >
        <Calendar className="w-3.5 h-3.5 text-primary-500" />
        <span>{getDisplayLabel()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Top Bar: Year Selector / Navigator */}
          <div className="flex items-center justify-between bg-muted/50 rounded-xl px-2 py-1.5 mb-3 border border-border/50">
            <button
              type="button"
              onClick={() => setActiveYear((prev) => prev - 1)}
              className="p-1 rounded-lg hover:bg-background text-foreground transition-colors"
              title="Previous Year"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowYearList(!showYearList)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg hover:bg-background font-extrabold text-xs text-foreground transition-colors border border-border/40"
              title="Click to select year directly"
            >
              <span>Year: {activeYear}</span>
              <ChevronDown className={`w-3 h-3 text-primary-500 transition-transform duration-150 ${showYearList ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setActiveYear((prev) => prev + 1)}
              className="p-1 rounded-lg hover:bg-background text-foreground transition-colors"
              title="Next Year"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Body: Either Scrollable Year List OR 3x4 Month Grid */}
          {showYearList ? (
            <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
              <div className="text-[10px] font-extrabold text-muted-foreground uppercase px-2 mb-1">
                Select Year First
              </div>
              <div className="grid grid-cols-3 gap-1">
                {years.map((year) => {
                  const isSelectedYear = activeYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setActiveYear(year);
                        setShowYearList(false);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isSelectedYear
                          ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                          : 'bg-background hover:bg-muted text-foreground border border-border/50'
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[10px] font-extrabold text-muted-foreground uppercase px-1 mb-2 flex items-center justify-between">
                <span>Select Month</span>
                <span className="text-primary-500 font-semibold">{activeYear}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MONTH_NAMES.map((m) => {
                  const isSelected = selectedYearMonth === `${activeYear}-${m.val}`;
                  const isCurrentActive = activeMonthVal === m.val;
                  return (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => handleMonthSelect(m.val)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25 scale-[1.02]'
                          : isCurrentActive && !selectedYearMonth
                          ? 'bg-primary-500/10 text-primary-500 border border-primary-500/30'
                          : 'bg-background hover:bg-muted text-foreground border border-border/60 hover:border-border'
                      }`}
                    >
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
