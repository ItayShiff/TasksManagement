CREATE TABLE Users (
    id varchar(50) NOT NULL,
    password varchar(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Tasks (
    user_id varchar(50) NOT NULL,
    id varchar(50) NOT NULL,
    title varchar(120) NOT NULL,
    description varchar(255) NOT NULL,
    completed boolean NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

INSERT INTO Users 
VALUES ("itay", "123456");

INSERT INTO Tasks 
VALUES ("itay", "1", "MyTaskTitle", "MyTaskDescrption", false);