import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>Distribuidora RJ - Painel de Controle</h1>
      </div>
      
      <nav className="main-nav">
        <ul>
          <li className="active"><a href="#motoristas">Motoristas</a></li>
          <li><a href="#estoque">Estoque</a></li>
          <li><a href="#relatorios">Relatórios</a></li>
        </ul>
      </nav>
      
      <div className="user-info">
        <span className="user-name">Admin</span>
        <button className="logout-btn">Sair</button>
      </div>
    </header>
  );
}

export default Header;