from datetime import datetime, timedelta
import calendar

now = datetime.now()

# Start of the month
start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

# End of the month
last_day = calendar.monthrange(now.year, now.month)[1]  # get last day of month
end_of_month = now.replace(day=last_day, hour=23, minute=59, second=59, microsecond=999999)

print("Start of month:", start_of_month)
print("End of month:", end_of_month)
