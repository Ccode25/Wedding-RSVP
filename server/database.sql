DROP TABLE IF EXISTS guestList;


CREATE TABLE guestList (
    id SERIAL PRIMARY KEY,
    guest TEXT,
    email TEXT,
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
