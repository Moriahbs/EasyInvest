import { useState, useRef, useEffect } from "react";

export const FilterMultiSelect = ({
  selected,
  options,
  onChange,
  label,
}: {
  selected: string[];
  options: string[];
  onChange: (value: string[]) => void;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[200px] pt-5 pb-5">
      {selected.length > 0 && (
        <div className="absolute top-0 right-0 flex items-center justify-between w-full text-blue-500 text-sm px-2">
          <span>{label}</span>
          <span
            onClick={() => onChange([])}
            className="cursor-pointer font-bold"
          >
            ✕
          </span>
        </div>
      )}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer border border-blue-500 text-blue-500 w-[200px] px-4 py-2 rounded-lg bg-white hover:bg-blue-50 flex justify-between items-center"
      >
        <span className="truncate">
          {selected.length > 0 ? selected.join(", ") : label}
        </span>
        <span>▼</span>
      </div>
      {open && (
        <div
          className="absolute mt-1 w-full bg-white border border-blue-300 rounded-lg shadow-md max-h-60 overflow-y-auto"
          style={{ zIndex: 1000 }}
        >
          {options.map((option) => (
            <label
              key={option}
              className="block px-4 py-2 text-blue-500 hover:bg-blue-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mx-2"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
