import dateFormat from 'dateformat';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Nav from './nav';
import StaffForm from './staff-form';
import { Slot } from './slot';

export const StaffSlots = (
        { navigationController, date, slots, startTime, duration }
    ) => {
    const formattedDate = dateFormat(date, 'dddd, d mmm yyyy');

    const goBack = () => {
        navigationController.popView();
    };


    const timeClick = (time, index) => () => {
        if (!startTime) {
            let slotsToCalculateEndTimes;
            if (slots.length > 1)
                slotsToCalculateEndTimes = slots.slice(index);
            else
                slotsToCalculateEndTimes = slots;
            const endTimes = [];
            for (let i = 0; i < slotsToCalculateEndTimes.length; i += 1) {
                const lastStartTime = moment.utc(
                    `${date.format('YYYY-MM-DD')} ${slotsToCalculateEndTimes[i]}`,
                    ['YYYY-MM-DD h:mm A']
                );
                const endingSlot = lastStartTime.add(duration, 'minutes');
                endTimes.push(endingSlot.format('h:mm A'));
            }
            navigationController.pushView(
              <StaffSlots
                  date={date}
                  navigationController={navigationController}
                  startTime={time}
                  slots={endTimes}
              />
            );
        } else
            navigationController.pushView(
              <StaffForm
                  date={date}
                  startTime={startTime}
                  endTime={time}
              />);
    };
    const timeType = startTime ? 'end' : 'start';
    return (
      <div className="staff-slots">
        <Nav leftClick={() => goBack()} />

        <div className="staff-slots-date">{formattedDate}</div>
        {
            slots.length ?
              <div>
                <p className="staff-slots-message">{ `Choose your ${timeType} time`}</p>
                <ul className="staff-slots-times">
                  {
                      slots.map((time, index) => (
                        <Slot
                            time={time}
                            key={`slot ${time}`}
                            index={index}
                            timeClick={timeClick}
                        />
                      ))
                  }
                </ul>
              </div>
              :
              <p className="staff-slots-message">No slots available!</p>
        }
      </div>
    );
};

StaffSlots.defaultProps = {
    startTime: '',
    duration: 0
};

StaffSlots.propTypes = {
    date: PropTypes.object.isRequired,
    slots: PropTypes.array.isRequired,
    navigationController: PropTypes.object.isRequired,
    startTime: PropTypes.string,
    duration: PropTypes.number
};


const mapStateToProps = (
    {
        staff: {
            selectedStaffMember: {
                selectedDate, slotsForDate
            },
            duration
        }
    }) => ({
        date: selectedDate,
        slots: slotsForDate,
        duration
    });

export default connect(mapStateToProps)(StaffSlots);
