FROM node:20-alpine AS frontend_builder

WORKDIR /frontend

RUN npm install -g pnpm 

COPY ./frontend/package.json ./frontend/pnpm-lock.yaml /frontend/

RUN pnpm install

COPY ./frontend /frontend/

RUN npm run build



# Stage 2: Run backend (Application)

FROM node:20-alpine

WORKDIR /backend

RUN npm install -g pnpm 

COPY ./backend/package.json ./backend/pnpm-lock.yaml /backend/ 

RUN pnpm install

COPY ./backend /backend/

COPY --from=frontend_builder /frontend/dist /backend/dist

CMD [ "npm","start" ]