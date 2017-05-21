import { expect } from 'chai';
import dateFormat from 'dateformat';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import moment from 'moment';
import noop from 'lib/util/noop';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import { findWithType, findAllWithType } from 'react-shallow-testutils';
import Nav from '../components/nav';
import StaffSlotsConnected, { StaffSlots } from '../components/staff-slots';
import StaffForm from '../components/staff-form';
import Slot from '../components/slot';
import { TIME_SLOT_SELECTED } from 'src/js/action-types';

describe('<StaffSlots>', () => {
    context('when rendered with slots', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const props = {
            date: currentDate,
            router: {},
            slots,
            dispatch: noop,
            slotForm: 'start'
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots', () => {
            expect(component).to.eql(
              <div className="staff-slots">

                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your start time</p>
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
              </div>
            );
        });
    });

    context('when slots are empty', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = [];
        const props = {
            date: currentDate,
            router: {},
            slots,
            slotForm: 'start',
            dispatch: noop
        };

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders no slots available message', () => {
            expect(component).to.eql(
              <div className="staff-slots">
                <div className="staff-slots-date">{formattedDate}</div>
                <p className="staff-slots-message">No slots available!</p>
              </div>
            );
        });
    });

    context('when time is clicked and start time is not set', () => {
        const currentDate = moment();
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const props = {
            date: currentDate,
            navigationController: {
                pushView: spy()
            },
            slots,
            duration: 60
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, Slot)[0];
            firstButton.props.timeClick(slots[0], 0)();
        });

        it('calls navigationController.pushView with StaffForm', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <StaffSlots
                  date={props.date}
                  navigationController={props.navigationController}
                  startTime={slots[0]}
                  slots={['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM']}
              />
            );
        });
    });

    context('when go back is clicked', () => {
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const props = {
            date: moment(),
            navigationController: {
                popView: spy()
            },
            slots
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const nav = findWithType(component, Nav);
            nav.props.leftClick();
        });

        it('calls navigationController.popView', () => {
            expect(props.navigationController.popView).to.have.been.calledOnce();
        });
    });

    context('when start time is set', () => {
    context('when slotForm is type start', () => {
        let component;

        const currentDate = moment();
        const formattedDate = dateFormat(currentDate, 'dddd, d mmm yyyy');
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const props = {
            date: currentDate,
            router: {},
            slots,
            slotForm: 'start',
            dispatch: noop
        };
        const timeClick = () => noop;

        before(() => {
            component = renderShallow(<StaffSlots {...props} />).output;
        });

        it('renders staff slots with start times', () => {
            expect(component).to.eql(
              <div className="staff-slots">
                <div className="staff-slots-date">{formattedDate}</div>
                <div>
                  <p className="staff-slots-message">Choose your start time</p>
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
              </div>
            );
        });
    });
    context('when time is clicked and start time is chosen', () => {
        const currentDate = moment();
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const props = {
            date: currentDate,
            router: {
                push: noop
            },
            dispatch: spy(),
            slots,
            duration: 60,
            slotForm: 'start'
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, Slot)[0];
            firstButton.props.timeClick(slots[0], 0)();
        });

        it(`dispatches ${TIME_SLOT_SELECTED}`, () => {
            expect(props.dispatch).to.have.been.calledWith(
                {
                    type: TIME_SLOT_SELECTED,
                    slotTime: slots[0],
                    slotType: 'startTime'
                }
            );
        });
    });

    context('when time is clicked and end time is chosen', () => {
        const currentDate = moment();
        const slots = ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM'];
        const props = {
            date: currentDate,
            router: {
                push: spy()
            },
            dispatch: spy(),
            slots,
            duration: 60,
            slotForm: 'end'
        };

        before(() => {
            const component = renderShallow(<StaffSlots {...props} />).output;
            const firstButton = findAllWithType(component, 'button')[0];
            firstButton.props.onClick(slots[0]);
        });

        it(`dispatches ${TIME_SLOT_SELECTED}`, () => {
            expect(props.dispatch).to.have.been.calledWith(
                {
                    type: TIME_SLOT_SELECTED,
                    slotTime: slots[0],
                    slotType: 'endTime'
                }
            );
        });

        it('calls router to push to /book', () => {
            expect(props.router.push).to.have.been.calledWith(
                '/book'
            );
        });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const router = {
            push: noop
        };
        const slots = ['7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM'];
        const currentDate = moment();
        const duration = 60;
        const slotForm = 'start';
        const selectedStaffMember = {
            id: 4,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            availableSlots: [
                {
                    date: currentDate,
                    slots
                }
            ],
            selectedDate: currentDate,
            slotsForDate: slots,
            slotForm
        };

        before(() => {
            store = createNew({ staff: { ...initialState, duration, selectedStaffMember } });
            component = renderShallow(
              <StaffSlotsConnected
                  store={store}
                  router={router}
              />
            ).output;
        });
        it('renders StaffSlots with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffSlots
                  dispatch={noop}
                  store={store}
                  router={router}
                  slots={slots}
                  slotForm={slotForm}
                  date={currentDate}
                  duration={duration}
              />
            );
        });
    });
});
