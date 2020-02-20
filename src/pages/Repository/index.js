import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';
import api from '../../services/api';

export default function Repository({ match: { params } }) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repoName = decodeURIComponent(params.repo);

    Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: { state: 'open', per_page: 5 },
      }),
    ]).then(([{ data: repo }, { data: issues }]) => {
      setRepository(repo);
      setIssues(issues);
      setLoading(false);
    });
  }, []);

  return <Container>Repository: {decodeURIComponent(params.repo)}</Container>;
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repo: PropTypes.string,
    }),
  }).isRequired,
};
