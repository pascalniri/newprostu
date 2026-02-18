ALTER TABLE universities
ADD COLUMN logo_url TEXT,
ADD COLUMN gallery_urls TEXT[] DEFAULT '{}';
