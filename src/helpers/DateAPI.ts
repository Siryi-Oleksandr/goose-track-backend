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

  public isFutureDate(date: string): boolean {
    // incoming date is "DD/MM/YYYY"
    const [day, month, year] = date.split("/");
    const formattedDate = `${month}/${day}/${year}`;
    const userDate = new Date(formattedDate);
    const currentDate = Date.now();

    if (userDate.getTime() > currentDate) {
      return true;
    }

    return false;
  }

  private convertTimeToTimestamp(timeString: string): number {
    const [hours, minutes] = timeString.split(":");

    const dateObject = new Date();
    dateObject.setHours(Number(hours));
    dateObject.setMinutes(Number(minutes));

    const timestamp = dateObject.getTime();
    return timestamp;
  }

  public isLaterEndTime(time1: string, time2: string): boolean {
    const timestamp1 = this.convertTimeToTimestamp(time1);
    const timestamp2 = this.convertTimeToTimestamp(time2);

    if (timestamp1 > timestamp2) {
      return false;
    }
    return true;
  }
}

const dateServise = new DateServise();

export { dateServise };
