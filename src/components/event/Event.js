import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import s from './Event.module.scss';
import NotFound from '../../pages/NotFound.js';

const apiUrl = (`https://vef2-20222-v3-synilausn.herokuapp.com/events/`)

Event.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  slug: PropTypes.string,
  description: PropTypes.string,
  limit: PropTypes.number,
}

export function Event({ id, name, slug, description, limit = -1}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [eventItem, setEventItem] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      let json;
      const url = new URL(id, apiUrl);
        
      try {
        const result = await fetch(url);
            
        if (result.status === 404) {
          setNotFound(true);
          return;
        }
            
        if (!result.ok) {
          throw new Error('result not ok');
        }
            
          json = await result.json();
      } catch (e) {
        console.warn('unable to fetch event', e);
        setError('Gat ekki sótt viðburð');
        return;
      } finally {
        setLoading(false);
      }
      
      setEventItem(json);
        
    }
    fetchData();
  }, [id]);

  if (error) {
    return (
      <p>Villa kom upp: {error}</p>  
    );
  }

  if (loading) {
    return (
      <p>Sæki gögn...</p>
    );
  }

  if (notFound) {
    return (
      <NotFound />
    );   
  }

  let items = [];

  if (eventItem && eventItem.items) {
    if (limit > 0) {
      items = eventItem.items.slice(0, limit);
    } else {
      items = eventItem.items;
    }
  }
  
  return (
    <section className={s.event}>
      <h2 className={s.event__title}>{eventItem && eventItem.title}</h2>
      {items.length === 0 && (
        <p>Engir viðburðir</p>
      )}
      <ul className={s.event__list}>
        {items.ength > 0 && items.map((item, i) => {
          return (
            <li className={s.event__item} key={i}>
              <a href={item.link}>{item.title}</a>
            </li>
          )
        })}
      </ul>

      <div className={s.event__links}>
        {eventItem.name && (
          <Link className={s.event__link} to={`/events/${eventItem.id}`}>Skoða viðburð</Link>
        )}
      </div>
    </section>
  );
}