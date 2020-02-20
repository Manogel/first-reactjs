import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Container from '../../Components/Container';

import { Loading, Owner, IssuesList, Label } from './styles';
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

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  return (
    <Container>
      <Owner>
        <Link to="/">Voltar aos repositiórios</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </Owner>

      <IssuesList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {issue.labels.map(label => (
                  <Label
                    className="label"
                    key={String(label.id)}
                    background={`#${label.color}`}
                  >
                    {label.name}
                  </Label>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>
    </Container>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repo: PropTypes.string,
    }),
  }).isRequired,
};
