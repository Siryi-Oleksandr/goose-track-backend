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

  public getChoosedMonth(date: string): string {
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