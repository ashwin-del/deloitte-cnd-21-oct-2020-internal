/**
 * Service to handle Events CRUD
 * Can be replaced by access to a real DBMS
 */

/**
 * mockData
 * Volatile data storage
 * @type {{events: [{description: string, id: number, title: string}]}}
 */
const mockData = {
    events: [
        { id: 1, title: 'an event', description: 'something really cool' },
        { id: 2, title: 'another event', description: 'something even cooler' }
    ]
};

/**
 * addEvent
 * @param event
 * @param returnEvents boolean default = true = returns all events, false = return only new event
 * @returns {{events: []}|{event: *}}
 */
const addEvent = async (event, returnEvents = true) => {
    event.id = mockData.events.length + 1;
    mockData.events.push(event);
    if(returnEvents) {
        return getEvents();
    } else {
        return {event: event};
    }
}

/**
 * getEvents
 * return all the non null entries in the events array
 * @returns {{events: []}}
 */
const getEvents = async (includeNulls = false) => {
    if (includeNulls) {
        return {events: mockData.events};
    } else {
        const events = [];
        mockData.events.forEach(ev => {if(!!ev) {events.push(ev)}});
        return {events: events};
    }
}

/**
 * getEventById
 * Returns the event from the events array referenced by the supplied ID
 * @param id
 * @returns {{event: ({description: string, id: number, title: string})}}
 */
const getEventById = async (id) => {
    const index = mockData.events.findIndex((obj => !!obj && obj.id === parseInt(id)));
    if(index !== -1) {
        return {event: mockData.events[index]};
    } else {
        return {event: {}};
    }
}

/**
 * getEventsByTitle
 * @param title string full or partial title
 * @returns array {{events: {description: string, id: number, title: string}[]}}
 */
const getEventsByTitle = async (title) => {
    const events = mockData.events.filter((obj => !!obj && obj.title.toLowerCase().includes(title.toLowerCase())));
    return {events};
}

/**
 * updateEvent
 * Updates the event in the events array referenced by the supplied ID
 * Only changes the modified fields/properties
 * @param id
 * @param event
 * @param returnEvents boolean default = true = returns all events, false = return only updated event
 * @returns {{event: {description: string, id: number, title: string}}|{events: *[]}}
 */
const updateEvent = async (id, event, returnEvents = true) => {
    event.id = parseInt(id);
    const index = mockData.events.findIndex((obj => !!obj && obj.id === parseInt(id)));
    mockData.events[index] = {...mockData.events[index], ...event};
    const updatedEvent = mockData.events[index];
    if(returnEvents) {
        return getEvents();
    } else {
        return {event: updatedEvent};
    }
}

/**
 * deleteEvent
 * Deletes the event referenced by the supplied ID from the events array
 * by setting the entry to null. This ensures that the length of the array
 * remains the same. Which is important because the length is used to
 * generate the next ID when a new Event is added
 * @param id
 * @param returnEvents
 * @returns {{deletedEvent: {description: string, id: number, title: string}}|{events: *[]}}
 */
const deleteEvent = async (id, returnEvents = true) => {
    const index = mockData.events.findIndex((obj => !!obj && obj.id === parseInt(id)));
    const event = mockData.events[index];
    delete mockData.events[index]; // sets the entry to null, maintains array length
    if(returnEvents) {
        return getEvents();
    } else {
        return {deletedEvent: event};
    }
}

const getEventsCount = async (includeNull = true) => {
    if(includeNull) {
        return mockData.events.length;
    } else {
        const events = [];
        mockData.events.forEach(ev => {if(!!ev) {events.push(ev)}});
        return events.length;
    }
}

const deleteLastEntry = async () => {
    mockData.events.pop();
}

// Makes the functions/methods available to other modules
module.exports = {addEvent, getEvents, getEventById, getEventsByTitle, updateEvent, deleteEvent, getEventsCount, deleteLastEntry};