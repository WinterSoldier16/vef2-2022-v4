import React, { useEffect, useState } from 'react';

import { Event } from '../event/Event';

import s from './EventList.module.scss';

const apiUrl = (`https://vef2-20222-v3-synilausn.herokuapp.com/events/`)

function EventList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      let json;

      try {
        const result = await fetch(apiUrl);

        if (!result.ok) {
          throw new Error('result not ok');
        }

        json = await result.json();
      } catch (e) {
        console.warn('unble to fetch eventList', e);
        setError('Gat ekki sótt viðburðalista');
        return;
      } finally {
        setLoading(false);
      }

      setEvents(json);
    }
    fetchData();
  }, []);

  if (error) {
    return (
      <p>Villla kom upp: {error}</p>
    );
  }

  if (loading) {
    return (
      <p>Sæki gögn...</p>
    );
  }

  return (
    <section className={s.eventList}>
    <div className={s.eventList__list}>
      {events.map((items) => {
        return (
          <div key={items.id} className={s.eventList__item}>
            <Event
              id={items.id}
              title={items.name}
              slug={items.slug}
              description={items.description}
            />
          </div>
        )
      })}
    </div>
    </section>
  );
}

export default EventList;