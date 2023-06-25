interface IStatistic {
  todo: number;
  inProgress: number;
  done: number;
}

interface ITask {
  category: "to-do" | "in-progress" | "done";
}

class StatisticsAPI {
  getStatisticByPeriod(array: ITask[] | []): IStatistic {
    let todo = 0;
    let inProgress = 0;
    let done = 0;
    const allTasks = array.length;

    array.forEach((elem) => {
      if (elem.category === "to-do") {
        todo++;
      }
      if (elem.category === "in-progress") {
        inProgress++;
      }
      if (elem.category === "done") {
        done++;
      }
    });

    let statistics: IStatistic = {
      todo: Math.round((todo / allTasks) * 100),
      inProgress: Math.round((inProgress / allTasks) * 100),
      done: Math.round((done / allTasks) * 100),
    };

    return statistics;
  }
}

const statisticsAPI = new StatisticsAPI();

export { statisticsAPI };
