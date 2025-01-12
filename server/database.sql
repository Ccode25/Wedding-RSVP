DROP TABLE IF EXISTS guestList;


CREATE TABLE guestList (
    id SERIAL PRIMARY KEY,
    guest TEXT,
    email TEXT NOT NULL,
    response TEXT DEFAULT '',
    CONSTRAINT valid_response CHECK (response IN ('', 'accept', 'decline'))
);



INSERT INTO guestList (guest) 
VALUES 
('John Doe'),
('Jane Smith'),
('Alice Johnson'),
('Bob Brown'),
('Charlie Wilson'),
('Diana Evans'),
('Edward Clark'),
('Fiona Lewis'),
('George Hall'),
('Hannah Scott');


CREATE TABLE guestResponses (
    id SERIAL PRIMARY KEY,
    guest_id INT REFERENCES guestList(id),  -- Foreign Key to guestList
    status TEXT DEFAULT 'pending' -- Status can be 'accepted' or 'declined'
);
