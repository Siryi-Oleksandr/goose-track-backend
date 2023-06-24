class DateServise {
  private formatNumber(value: number): string {
    return value.toString().padStart(2, "0");
  }

  private getCurentMonth() {
    const currentDate = new Date();

    const currentMonth = currentDate.getMonth() + 1; // transition to usual month (12)
    const currentYearh = currentDate.getFullYear();

    return `${currentYearh}-${this.formatNumber(currentMonth)}`;
  }

  private getChoosedMonth(date: string): string {
    // income YYYY-MM-DD
    return date.slice(0, 7); // YYYY-MM
  }

  public getFilterDate(params: object): string {
    const { day, month } = params as {
      day?: string;
      month?: string;
    };

    let filter = "";

    if (day) {
      filter = day;
    } else if (month) {
      filter = this.getChoosedMonth(month);
    } else {
      filter = this.getCurentMonth();
    }

    return filter;
  }
}

const dateServise = new DateServise();

export { dateServise };

// TODO Delete before release

// function formatNumber(value: number): string {
//   return value.toString().padStart(2, "0");
// }

// function getCurentMonth() {
//   const currentDate = new Date();

//   const currentMonth = currentDate.getMonth() + 1; // transition to usual month (12)
//   const currentYearh = currentDate.getFullYear();

//   return `${currentYearh}-${formatNumber(currentMonth)}`;
// }

// function getChoosedMonth(date: string): string {
//   // income YYYY-MM-DD
//   return date.slice(0, 7); // YYYY-MM
// }

// export function getFilterDate(params: object): string {
//   const { day, month } = params as {
//     day?: string;
//     month?: string;
//   };

//   let filter = "";

//   if (day) {
//     filter = day;
//   } else if (month) {
//     filter = getChoosedMonth(month);
//   } else {
//     filter = getCurentMonth();
//   }

//   return filter;
// }
