import { addHours, addMinutes, compareAsc, format } from "date-fns";
import { prisma } from "../../shared/prisma";
const insertIntoDB = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;
  console.log({ payload });
  const intervalTime = 30;
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      // update start time after booking

      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime
      );
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

export const ScheduleService = {
  insertIntoDB,
};
