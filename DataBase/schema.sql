drop table if exists volunteer, host, sign_in, Service, admin, admin_sign_in, feedback;

CREATE TABLE IF NOT EXISTS volunteer (
  id SERIAL PRIMARY KEY UNIQUE,
  user_name VARCHAR (50) NOT NULL UNIQUE,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  password VARCHAR (255) NOT NULL,
  description text,
  email VARCHAR (255) NOT NULL UNIQUE,
  country VARCHAR (50) NOT NULL,
  birth_date DATE NOT NULL,
  skills VARCHAR (50),
  passport text,
  address VARCHAR (50) NOT NULL,
  rating int,
  profile_image text,
  token text
);
CREATE TABLE IF NOT EXISTS host (
  id SERIAL PRIMARY KEY UNIQUE,
  user_name VARCHAR (50) NOT NULL UNIQUE,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  password VARCHAR (255) NOT NULL,
  description text,
  email VARCHAR (255) NOT NULL UNIQUE,
  country VARCHAR (50) NOT NULL,
  birth_date DATE NOT NULL,
  category VARCHAR (50),
  address VARCHAR (50) NOT NULL,
  rating int,
  profile_image text,
  token text
);
CREATE TABLE IF NOT EXISTS sign_in (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR (50) NOT NULL UNIQUE,
  Password VARCHAR (255) NOT NULL
);
-- ALTER TABLE sign_in ADD COLUMN volunteer_id INT REFERENCES volunteer(id)
-- ALTER TABLE sign_in ADD COLUMN host_id INT REFERENCES host(id)
CREATE TABLE IF NOT EXISTS Service (
  id SERIAL PRIMARY KEY,
  title VARCHAR (50) NOT NULL,
  description text NOT NULL,
  country VARCHAR (50) NOT NULL,
  type VARCHAR (50) NOT NULL,
  details VARCHAR (255) NOT NULL,
  duration VARCHAR (50) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  working_hours VARCHAR (50) NOT NULL,
  working_days VARCHAR (50) NOT NULL,
  minumim_age INT NOT NULL,
  address VARCHAR (255) NOT NULL,
  profile_image text,
  host_id INT ,
  FOREIGN KEY (host_id) REFERENCES host (id) ON DELETE CASCADE
);
-- ALTER TABLE service ADD COLUMN host_id INT REFERENCES host(id)
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR (50) NOT NULL UNIQUE ,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  Password VARCHAR (255) NOT NULL,
  email VARCHAR (255) NOT NULL UNIQUE,
  token text
);
CREATE TABLE IF NOT EXISTS admin_sign_in (
  id SERIAL PRIMARY KEY,
  email VARCHAR (255) NOT NULL,
  confirmation_code VARCHAR (50) NOT NULL,
  Password VARCHAR (255) NOT NULL
);
-- ALTER TABLE admin_sign_in ADD COLUMN admin_id INT REFERENCES admin(id)
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  description text
);
-- ALTER TABLE feedback ADD COLUMN volunteer_id INT REFERENCES volunteer(id)
-- CREATE TABLE IF NOT EXISTS hostservice (
--   id SERIAL PRIMARY KEY,
--   description text
-- );