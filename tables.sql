CREATE TABLE Users ( user_id int AUTO_INCREMENT NOT NULL.
email varchar(255) NOT NULL, 
first_name varchar(255), last_name varchar(255),
password varchar(255) NOT NULL, 
PRIMARY KEY (user_id));

CREATE TABLE Budget (budget_id int NOT NULL, month_year varchar(15) NOT NULL, income int NOT NULL, PRIMARY KEY (budget_id))