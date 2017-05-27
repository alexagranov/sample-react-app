import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import noop from 'lib/util/noop';
import { createNew } from 'src/js/store';
import { findWithType } from 'react-shallow-testutils';
import { DATE_SELECTED } from 'src/js/action-types';
import { initialState } from 'src/js/reducers/staff';
import Nav from '../components/nav';
import StaffCalendarConnected, { StaffCalendar } from '../components/staff-calendar';
import StaffSlots from '../components/staff-slots';
import CustomCalNavBar from '../components/custom-cal-nav-bar';


describe('<StaffCalendar>', () => {
    context('when rendered with props', () => {
        let component;
        const props = {
            router: {},
            dispatch: noop,
            availableSlots: {
                '2017-03-31': [
                    '02:00 PM'
                ]
            },
            month: moment.utc(),
            id: 10001
        };

        // push every date before 3/31 to disabledDates
        const disabledDates = [];
        for (let i = 1; i < 31; i += 1)
            disabledDates.push(new Date(`2017-03-${i}`));


        before(() => {
            component = renderShallow(<StaffCalendar {...props} />).output;
        });

        it('renders a staff calendar', () => {
            expect(component).to.eql(
              <div className="staff-calendar">
                <div className="staff-calendar-picker">
                  <DayPicker
                      onDayClick={noop}
                      weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                      disabledDays={disabledDates}
                      navbarElement={
                        <CustomCalNavBar
                            dispatch={props.dispatch}
                        />
                      }
                      month={props.month.toDate()}
                  />
                </div>
              </div>
            );
        });
    });

    context('when a calendar day is clicked', () => {
        const props = {
            router: {
                push: spy()
            },
            dispatch: spy(),
            availableSlots: {
                '2017-03-31': [
                    '02:00 PM'
                ]
            },
            id: 10001
        };
        const day = moment.utc();

        before((done) => {
            const component = renderShallow(<StaffCalendar {...props} />).output;
            const dayPicker = findWithType(component, DayPicker);
            setTimeout(() => {
                dayPicker.props.onDayClick(day);
                done();
            });
        });

        it(`dispatches ${DATE_SELECTED}`, () => {
            expect(props.dispatch).to.have.been.calledWith(
                { type: DATE_SELECTED, date: day }
            );
        });

        it('calls router to push to /available_slots', () => {
            expect(props.router.push).to.have.been.calledWith('/available_slots');
        });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const router= {};
        const selectedStaffMember = {
            id,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots:
            {
                '2017-04-01': ['7:00 PM', '8:00 PM']
            }
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <StaffCalendarConnected
                  store={store}
                  router={router}
              />
           ).output;
        });
        it('renders StaffCalendar with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffCalendar
                  dispatch={noop}
                  store={store}
                  navigationController={navigationController}
                  availableSlots={selectedStaffMember.availableSlots}
                  router={router}
                  id={id}
              />
            );
        });
    });
});
