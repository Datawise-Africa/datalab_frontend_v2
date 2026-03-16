import filter_icon from '/assets/datalab/filter-icon.svg';

const FilterIcon = () => {
  return (
    <div className="flex gap-1">
      <img src={filter_icon} alt="" className="h-6 w-4" />
      <p>Filter</p>
    </div>
  );
};

export default FilterIcon;
