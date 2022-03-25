const apiUrl = (`https://vef2-20222-v3-synilausn.herokuapp.com/events/`)

Event.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    limit: PropTypes.number,
}