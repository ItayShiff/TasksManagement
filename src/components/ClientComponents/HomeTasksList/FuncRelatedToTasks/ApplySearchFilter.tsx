import React, { useRef, useState } from "react";
import styles from "./ApplySearchFilter.module.css";
import tasksStore from "@/components/Task/tasks-store";
import { FilterBy } from "./FuncRelatedToTasks";
import { toast } from "react-toastify";

type Props = {
  filterByOptions: string[];
};

const ApplySearchFilter = ({ filterByOptions }: Props) => {
  const [currentSearchFilter, setCurrentSearchFilter] = useState<string>(filterByOptions[FilterBy.No_Filter]);
  const searchInput = useRef<HTMLInputElement>(null);
  const didApplyFilterAlready = useRef<boolean>(false); // To avoid calling GetAllTasks() every time the user switches to option No Filter

  const applyFilter = () => {
    if (currentSearchFilter === filterByOptions[FilterBy.No_Filter]) {
      toast.error("You need to set a filter prior to search");
      return;
    }

    const value = searchInput.current?.value && searchInput.current.value.trim();
    if (value && value !== "") {
      didApplyFilterAlready.current = true;

      switch (currentSearchFilter) {
        case filterByOptions[FilterBy.User_ID]:
          tasksStore.filterTasksByUserID(value);
          break;
        case filterByOptions[FilterBy.Task_ID]:
          tasksStore.filterTasksByTaskID(value);
          break;
      }
    } else {
      toast.error("You didn't fill in any data in input");
    }
  };

  const changeFilterName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSearchFilter(filterByOptions[e.target.selectedIndex]);
    if (e.target.selectedIndex === FilterBy.No_Filter) {
      if (didApplyFilterAlready.current) {
        // This way, it will be call getAllTasks only if the user already filtered in the past, to avoid unnecessary API calls
        tasksStore.getAllTasks();
        searchInput.current!.value = "";
        didApplyFilterAlready.current = false; // Resetting for next time
      }
    }
  };

  return (
    <div id={styles.wrapper}>
      <div>
        <div id={styles.filterOptionsTitle}>Filter Options</div>
        <select defaultValue={filterByOptions[0]} onChange={(e) => changeFilterName(e)}>
          {filterByOptions.map((currentFilter: string) => (
            <option key={currentFilter} value={currentFilter}>
              {currentFilter}
            </option>
          ))}
        </select>
      </div>

      <input
        ref={searchInput}
        id={styles.search}
        placeholder={
          currentSearchFilter === filterByOptions[FilterBy.No_Filter]
            ? "Select a filter to start filtering"
            : `Enter ${currentSearchFilter} to filter all tasks by ${currentSearchFilter}, then hit Search`
        }
        disabled={currentSearchFilter === filterByOptions[FilterBy.No_Filter]}
      />

      <button onClick={applyFilter}>Search</button>
    </div>
  );
};

export default React.memo(ApplySearchFilter);
