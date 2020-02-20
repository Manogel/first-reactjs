import React from 'react';

import { Container } from './styles';

export default function Repository({ match: { params } }) {
  return <Container>Repository: {decodeURIComponent(params.repo)}</Container>;
}
