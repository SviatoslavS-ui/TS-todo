export const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
] as const;

export const TIME_PERIODS = {
    MORNING: { start: 6, end: 12, label: "morning" },
    DAY: { start: 12, end: 17, label: "day" },
    EVENING: { start: 17, end: 22, label: "evening" },
    NIGHT: { start: 22, end: 6, label: "night" },
} as const;

export const getTimeOfDay = (hours: number): string => {
    switch (true) {
        case hours >= TIME_PERIODS.MORNING.start &&
            hours < TIME_PERIODS.MORNING.end:
            return TIME_PERIODS.MORNING.label;
        case hours >= TIME_PERIODS.DAY.start && hours < TIME_PERIODS.DAY.end:
            return TIME_PERIODS.DAY.label;
        case hours >= TIME_PERIODS.EVENING.start &&
            hours < TIME_PERIODS.EVENING.end:
            return TIME_PERIODS.EVENING.label;
        default:
            return TIME_PERIODS.NIGHT.label;
    }
};

export const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = MONTHS[date.getMonth()];
    return `${day} ${month}`;
};
