# Technical Review

## What went well? Please share a link to the specific code.

### Mocking up the Database Early

Admittedly, I was doing this begrudgingly when Akira suggested I do so to avoid having to wait for a backend for too long. On hindsight, it paid off, because I have to spin off an actual Express backend and PostgreSQL database for the presentations.

I know that it is a known practice for front-end developers to mock up their own data using NoSQL databases, or simply with mock JSON files. However, how common is this? When I first embarked on it, it really felt like I was doing double-work.

Even without a database, with just an Express application with a `response.send` of mock data, you will still an Express backend set up.

### Final Setup of the Database Models

In the end, I have 3 tables set up to model calendar events per month: `events`, `optimisations`, and `schedules`. You can find the models/migrations [here](https://github.com/leechuanxin/hrms-express-seed/blob/main/migrations/20210215163115-trips.js).

`events` refer to the workers' preferred shift and leave dates, as they have indicated on the calendar UI. `schedules` refer to an identifier for a month, pertaining to the admins' perspective on the final chosen optimised events for all of the workers. `optimisations` refer to each individual event chosen, optimised and organised for the month for all the workers based on the linear programming algorithm we seek to implement.

It was deceptively simple to think of 1 month of events, preferred (from the workers' perspective) or optimised (from the admin's), as a JSON object stored in the database. In fact, that's how we originally visualised the information.

However, we realised quickly it will make modifications of each individual event a lot trickier. We can't apply database constraints and model validations smoothly on said non-relational data. 

Additionally, visualising these as relational data will allow us to form relations easier - I can associate any event to an organisation or a worker should I intend to develop this further to a less bespoke HRMS.

## What were the biggest challenges you faced? Please share a link to the specific code. What would you do differently next time?

### Visualising Foreign Key Constraints, and Typos in Seeders

There was a badly seeded piece of data from adding a row to `optimisations`, caused by a typo.

The `organisations` table is not required for the scope of the presentation, because we intend only to present the perspective of a single organisation. However, it may be useful later should we continue on this project and develop it to be a less bespoke HRMS.

The typo came from accidentally adding an entry to the `optimisations` table with an `organisation_id` of `2`, when there wasn't one such organisation seeded in the database.

It did take me a few hours to resolve this, the error message `ERROR: insert or update on table "users" violates foreign key constraint "users_organisation_id_fkey"` doesn't seem very clear to me. I thought it meant something was wrong with my model instead of the seed data.

It was eventually resolved in this [commit](https://github.com/leechuanxin/hrms-express-seed/commit/116c424281b9a7db5b3b7f55cd383f4fcdd530ec).

### Inconsistent Use of Database Relations and Lack of Modularisation

'nuff said, you can simply refer to [this EventsController file](https://github.com/leechuanxin/hrms-express-seed/blob/main/controllers/events.mjs).

While I have been retrieving certain information using the methods provided by Sequelize Models (`something.getUser()` etc), I have not been practising it much for the lack of time and clarity of thought. This caused the code to be a little more bloated.

Likewise, there are plenty of long methods in the EventsController. However, that's again due to the lack of time. I was largely re-using already badly written code in the previous methods when setting up the new ones.

# Process Review

### What went well?

Mocking up the database early, and the final setup of the database models, as mentioned above.

### What could have been better?

Using Django was a major risk that ended up being a big downfall. It is a backend framework, and it's indeed true when it's stated online that you may not need to know Python fluently to use it. However, it requires a solid understanding of the backend conceptually: templating, REST frameworks, database relations, ORMs etc. Too much time was spent wrangling with Django that by the time we came to thinking about modelling our databases, we were too tilted.

We thought we needed a Python-based backend to use a Python library, when we could have stuck with where we were most comfortable: Express. Express seemingly allows you to run Python scripts as a child process, using the `child_process` Node library. While we didn't get to test out running the LP solver library using Node, it ought to be a direction we should have considered early.

I could have further optimised my time while waiting for the backend, but again I feel I am also speaking with hindsight bias. As mentioned above, I did feel like I was unnecessarily doing double-work when setting up the mock data using an Express backend.

### What would you do differently next time?

The way we delineated responsibilities was flawed for this project, especially when they were a lot of "unknown unknowns" at the start pertaining to the Python LP solver library and Django.

In fact, perhaps we could have scoped our project down further so we need only worry about one problem at the time. For instance, we could have looked into how we can execute Python scripts through Node first. Only when we cannot seem to run it on Node should we consider using a Python-based backend.

Regarding responsibilities, we split the work and research strictly in terms of: front-end developer vs. backend developer. Such a separation of tasks and concerns ended up being a problem when either of us got *very* blocked. It would have been difficult to jump into the other person's work further ahead in the project.

A feature-based delineation of work instead of thinking in terms of roles would have been a better fit, so that anyone could take over from the other if we got stuck.