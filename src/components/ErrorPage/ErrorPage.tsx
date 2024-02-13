import './ErrorPage.scss';

function ErrorPage(message) {
  return (
    <div className="not-found">
      <h1>500</h1>
      <p>Désolé, une erreur inattendue est survenue.</p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
}

export default ErrorPage;
