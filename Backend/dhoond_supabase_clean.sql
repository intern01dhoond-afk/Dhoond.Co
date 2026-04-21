--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: booking_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_items (
    id integer NOT NULL,
    booking_id integer,
    service_id integer,
    quantity integer NOT NULL,
    price real NOT NULL
);


--
-- Name: booking_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_items_id_seq OWNED BY public.booking_items.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer,
    customer_name text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    total_amount real NOT NULL,
    status text DEFAULT 'Pending'::text,
    payment_status text DEFAULT 'Unpaid'::text,
    payment_id text,
    start_otp text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payment_method text DEFAULT 'pay_after'::text,
    razorpay_order_id text
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    partner_id integer,
    category_id integer,
    address text NOT NULL,
    price real NOT NULL,
    platform_fee real,
    status text DEFAULT 'Pending'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    items jsonb
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name text NOT NULL,
    profession text,
    current_location text,
    status text DEFAULT 'Off duty'::text,
    work_status text DEFAULT 'idle'::text,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone character varying(15),
    experience character varying(50),
    partner_docs jsonb DEFAULT '{}'::jsonb
);


--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    amount real NOT NULL,
    payment_method text NOT NULL,
    payment_status text DEFAULT 'Pending'::text,
    transaction_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    original_price real,
    discount_price real,
    discount_tag text,
    description text,
    image text,
    category_id integer
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    phone text NOT NULL,
    email text,
    role text DEFAULT 'user'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: booking_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_items ALTER COLUMN id SET DEFAULT nextval('public.booking_items_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: booking_items; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders VALUES (1, 1, NULL, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Pending', '2026-04-16 16:10:37.531456', NULL);
INSERT INTO public.orders VALUES (2, 1, NULL, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Pending', '2026-04-16 16:36:08.68403', NULL);
INSERT INTO public.orders VALUES (3, 7, NULL, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Pending', '2026-04-16 16:41:44.55512', NULL);
INSERT INTO public.orders VALUES (4, 7, NULL, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Pending', '2026-04-16 17:01:28.445702', NULL);
INSERT INTO public.orders VALUES (5, 7, NULL, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Pending', '2026-04-16 17:07:13.450737', NULL);
INSERT INTO public.orders VALUES (6, 1, NULL, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Pending', '2026-04-16 17:19:06.527781', NULL);
INSERT INTO public.orders VALUES (7, 1, 1, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Confirmed', '2026-04-16 17:31:21.576067', NULL);
INSERT INTO public.orders VALUES (8, 1, NULL, NULL, 'Home - 78, 25th Main Rd, near Kamataka Ban...', 1, 0, 'Pending', '2026-04-16 18:48:01.510365', '[{"id": 96, "price": 1, "title": "Painting Expert Consultation", "quantity": 1}]');


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.partners VALUES (1, 'Test Partner', '', '', 'Off duty', 'idle', '2026-04-16 10:48:39.70916', NULL, NULL, '{}');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments VALUES (1, 1, 1, 'upi', 'success', 'pay_Se8P3Ea80yqjSz', '2026-04-16 16:10:37.59546');
INSERT INTO public.payments VALUES (2, 2, 1, 'upi', 'success', 'pay_Se8q19kNK7egYJ', '2026-04-16 16:36:08.725514');
INSERT INTO public.payments VALUES (3, 3, 1, 'upi', 'success', 'pay_Se8vu82wg79YCi', '2026-04-16 16:41:44.597312');
INSERT INTO public.payments VALUES (4, 4, 1, 'upi', 'success', 'pay_Se9GbT3Ow8YoBX', '2026-04-16 17:01:28.512043');
INSERT INTO public.payments VALUES (5, 5, 1, 'upi', 'success', 'pay_Se9MqectXrCDdJ', '2026-04-16 17:07:13.497913');
INSERT INTO public.payments VALUES (6, 6, 1, 'upi', 'success', 'pay_Se9ZMZuW9xSpPk', '2026-04-16 17:19:06.567301');
INSERT INTO public.payments VALUES (7, 7, 1, 'upi', 'success', 'pay_Se9mK32HOhZ9LD', '2026-04-16 17:31:21.626745');
INSERT INTO public.payments VALUES (8, 8, 1, 'upi', 'success', 'pay_SeB5Kgpa9GnqkY', '2026-04-16 18:48:01.561486');


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.services VALUES (75, 'Switch / Socket Replacement', 'electrician', 299, 199, '33% OFF', 'Safe replacement of switches or plug sockets.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (76, 'Submeter Installation', 'electrician', 599, 449, '25% OFF', 'Electric sub-meter installation.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (77, 'Inverter Repair & Diagnostics', 'electrician', 499, 399, '20% OFF', 'Diagnostics and repair for home and office power inverters.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (78, 'MCB Box Installation/Repair', 'electrician', 899, 699, '22% OFF', 'Safe installation or troubleshooting of Main Circuit Breaker boxes.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (79, 'House Wiring Checkup', 'electrician', 499, 299, '40% OFF', 'Complete diagnostic check of home electrical wiring to prevent short circuits.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (80, 'Decorative Light Installation', 'electrician', 499, 349, '30% OFF', 'Fixing and wiring chandeliers, wall brackets, or profile lights.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (81, 'AC Cleaning Service (Jet+Water)', 'technician', 699, 499, '29% OFF', 'High-pressure jet and water cleaning for AC indoor unit, filters, and coils.', '/ac_installation.jpg', NULL);
INSERT INTO public.services VALUES (82, 'AC Installation (Split)', 'technician', 1499, 999, '33% OFF', 'Professional installation of split AC indoor and outdoor units.', '/ac_installation.jpg', NULL);
INSERT INTO public.services VALUES (83, 'AC Uninstallation (Split)', 'technician', 799, 499, '37% OFF', 'Safe removal and disconnection of split AC units.', '/ac_installation.jpg', NULL);
INSERT INTO public.services VALUES (84, 'Geyser Repair & Installation', 'technician', 799, 599, '25% OFF', 'Expert installation or thermostat repair of water heater geysers.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (85, 'RO Servicing & Filter Change', 'technician', 599, 449, '25% OFF', 'Servicing and filter replacement for RO water purifiers.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (86, 'Washing Machine Repair', 'technician', 899, 699, '22% OFF', 'Fixing drum, motor, or drainage issues in washing machines.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (87, 'Refrigerator Gas Refill', 'technician', 1599, 1299, '18% OFF', 'Gas refilling and cooling check for single and double door refrigerators.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (88, 'TV Wall Mounting', 'technician', 499, 349, '30% OFF', 'Secure wall mounting setup for LED/LCD TVs up to 65 inch.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (89, 'Microwave Oven Repair', 'technician', 599, 399, '33% OFF', 'Magnetron replacement and keypad fixes for all microwave brands.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (90, 'Bathroom Drain Unclogging', 'plumber', 399, 249, '37% OFF', 'Clearing severe clogs and blockages in bathroom drains and pipes.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (91, 'Sink Faucet Replacement', 'plumber', 299, 199, '33% OFF', 'Replacement and sealing of kitchen or basin faucets.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (92, 'Water Tank Deep Cleaning', 'plumber', 1199, 899, '25% OFF', 'Deep mechanical and chemical cleaning of overhead water tanks.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (93, 'Toilet Seat Repair/Replacement', 'plumber', 799, 599, '25% OFF', 'Changing western toilet seats, flush tanks, or fixing leakages.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (94, 'Concealed Pipeline Leak Fix', 'plumber', 1499, 1199, '20% OFF', 'Detecting and fixing water leaks inside walls without damaging tiles if possible.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (95, 'Shower & Mixer Installation', 'plumber', 499, 349, '30% OFF', 'Installing bathroom diverters, shower heads, or hot/cold mixers.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (98, '1 BHK Full Painting (Interior)', 'painter', 8999, 6999, '22% OFF', 'Complete interior wall and ceiling painting for 1 BHK homes using premium emulsion paints.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (99, '2 BHK Full Painting (Interior)', 'painter', 14999, 11999, '20% OFF', 'Premium tractor or royale emulsion painting for a 2 BHK setup with professional finish.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (100, '3 BHK Full Painting (Interior)', 'painter', 21999, 17499, '20% OFF', 'Complete interior painting for 3 BHK homes ΓÇö walls, ceilings & trims using top-grade paints.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (101, '4 BHK / Villa Full Painting', 'painter', 34999, 27999, '20% OFF', 'End-to-end interior painting for large 4 BHK homes and villas using luxury emulsion finish.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (102, 'Exterior Wall Painting (Single)', 'painter', 5999, 4499, '25% OFF', 'Weather-proof exterior painting for a single outer wall or balcony using all-weather paint.', '/exterior_painting.webp', NULL);
INSERT INTO public.services VALUES (103, 'Full Exterior Home Painting', 'painter', 24999, 18999, '24% OFF', 'Complete exterior painting for independent homes with weather-resistant premium coatings.', '/exterior_painting.webp', NULL);
INSERT INTO public.services VALUES (104, 'Office Painting (per 1000 sq ft)', 'painter', 12999, 9999, '23% OFF', 'Professional office interior painting with minimal downtime and industrial-grade finish.', '/commercial_painting.jpg', NULL);
INSERT INTO public.services VALUES (105, 'School / College Painting', 'painter', 29999, 22999, '23% OFF', 'Safe, durable and vibrant painting solutions for educational institutions.', '/commercial_painting.jpg', NULL);
INSERT INTO public.services VALUES (106, 'Warehouse / Industrial Coating', 'painter', 39999, 31999, '20% OFF', 'Heavy-duty epoxy and industrial coatings for warehouses and factory floors.', '/commercial_painting.jpg', NULL);
INSERT INTO public.services VALUES (107, 'Texture / Designer Wall Painting', 'painter', 6999, 4999, '28% OFF', 'Artistic texture finishes ΓÇö sand, bark, venetian plaster & designer patterns for accent walls.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (108, 'Wallpaper Installation', 'painter', 3999, 2999, '25% OFF', 'Professional wallpaper fitting for feature walls and full rooms with precision alignment.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (109, 'Stencil & Pattern Art', 'painter', 3499, 2499, '28% OFF', 'Custom stencil patterns, geometric art and mural designs for modern interiors.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (110, 'Specialty Coatings (Grills, Gates & Doors)', 'painter', 4999, 3499, '30% OFF', 'Epoxy & protective anti-rust coatings for iron grills, gates and metal doors.', '/grill_gate.png', NULL);
INSERT INTO public.services VALUES (111, 'Wood Polishing & Varnish', 'painter', 3499, 2699, '23% OFF', 'Sanding, polishing and varnishing for doors, windows, cabinets or wooden furniture.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (112, 'Waterproofing & Damp Fix', 'painter', 7999, 5999, '25% OFF', 'Professional waterproof coating treatment for terrace, bathroom and damp interior walls.', '/exterior_painting.webp', NULL);
INSERT INTO public.services VALUES (113, 'Touch-up Painting (Spot Fix)', 'painter', 2499, 1899, '24% OFF', 'Patching up peeling walls, damp spots, or small damage areas ΓÇö perfect post-renovation fix.', '/interior.jpg', NULL);
INSERT INTO public.services VALUES (114, 'Cockroach Pest Control', 'pest-control', 1299, 999, '23% OFF', 'Intensive spray and gel pest control specifically targeting cockroaches.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (115, 'Termite Treatment', 'pest-control', 3499, 2899, '17% OFF', 'Professional drill-and-inject termite extermination for furniture and walls.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (116, 'Bed Bug Extermination', 'pest-control', 1899, 1499, '21% OFF', 'Dual-spray treatment to completely remove bedbugs from mattresses and frames.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (96, 'Painting Expert Consultation', 'painter', 499, 1, '80% OFF', 'Digital laser measurement, shade selection & palette help, and detailed cost estimation by a certified painting expert.', '/consultation.png', NULL);
INSERT INTO public.services VALUES (74, 'Ceiling Fan Installation', 'electrician', 399, 299, '25% OFF', 'Professional installation of ceiling fan.', '/ac_tech.png', NULL);
INSERT INTO public.services VALUES (97, 'Commercial Painting Expert Consultation', 'painter', 499, 99, '80% OFF', 'On-site expert assessment for offices, schools, warehouses & large-scale commercial properties. Includes BOQ & timeline.', '/commercial_painting.jpg', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (2, 'Customer', '9337063446', NULL, 'admin', '2026-04-15 15:18:53.427011');
INSERT INTO public.users VALUES (7, 'Customer', '7411087698', NULL, 'user', '2026-04-16 16:40:48.495422');
INSERT INTO public.users VALUES (1, 'Hemanth', '7204948579', NULL, 'admin', '2026-04-15 15:06:16.027881');


--
-- Name: booking_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.booking_items_id_seq', 37, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_id_seq', 37, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 8, true);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partners_id_seq', 1, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 8, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 116, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: booking_items booking_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_items
    ADD CONSTRAINT booking_items_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: booking_items booking_items_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_items
    ADD CONSTRAINT booking_items_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: booking_items booking_items_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_items
    ADD CONSTRAINT booking_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders orders_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partners(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


