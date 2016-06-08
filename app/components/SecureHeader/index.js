import React from 'react';
import './styles.scss'

export default function SecureHeader() {
  return (
    <header className="SecureHeader">
      <div className="SecureHeader-wrapper">
        <aside className="SecureHeader-logo">
          <img src="https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_square.png" alt="Logo" />
        </aside>
        <nav role="navigation" className="SecureHeader-nav">
          <ul className="SecureHeader-menu">
            <li className="SecureHeader-navLink">
              <a className="is-active">Dashboard</a>
            </li>
            <li className="SecureHeader-navLink">
              <a>Reporting</a>
            </li>
            <li className="SecureHeader-navLink">
              <a>Creatives</a>
            </li>
            <li className="SecureHeader-navLink">
              <a>Tools</a>
            </li>
          </ul>
        </nav>
        <div className="SecureHeader-account">
          <div className="SecureHeader-accountWelcome">
            <span>Welcome, John Doe</span>
            <a className="SecureHeader-accountHelp">Need Help?</a>
          </div>
          <div className="SecureHeader-accountMenu">
            Account
          </div>
        </div>
      </div>
    </header>
  );
}
//
//
// <header class="centered-navigation" role="banner">
//   <div class="centered-navigation-wrapper">
//     <a href="javascript:void(0)" class="mobile-logo">
//       <img src="https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_square.png" alt="Logo image">
//     </a>
//     <a href="javascript:void(0)" id="js-centered-navigation-mobile-menu" class="centered-navigation-mobile-menu">MENU</a>
//     <nav role="navigation">
//       <ul id="js-centered-navigation-menu" class="centered-navigation-menu show">
//         <li class="nav-link"><a href="javascript:void(0)">Products</a></li>
//         <li class="nav-link"><a href="javascript:void(0)">About Us</a></li>
//         <li class="nav-link"><a href="javascript:void(0)">Contact</a></li>
//         <li class="nav-link logo">
//           <a href="javascript:void(0)" class="logo">
//             <img src="https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_square.png" alt="Logo image">
//           </a>
//         </li>
//         <li class="nav-link"><a href="javascript:void(0)">Testimonials</a></li>
//         <li id="js-centered-more" class="nav-link more"><a href="javascript:void(0)">More</a>
//           <ul class="submenu">
//             <li><a href="javascript:void(0)">Submenu Item</a></li>
//             <li><a href="javascript:void(0)">Another Item</a></li>
//             <li class="more"><a href="javascript:void(0)">Item with submenu</a>
//               <ul class="submenu fly-out-right">
//                 <li><a href="javascript:void(0)">Sub-submenu Item</a></li>
//                 <li><a href="javascript:void(0)">Another Item</a></li>
//               </ul>
//             </li>
//             <li class="more"><a href="javascript:void(0)">Another submenu</a>
//               <ul class="submenu fly-out-right">
//                 <li><a href="javascript:void(0)">Sub-submenu</a></li>
//                 <li><a href="javascript:void(0)">An Item</a></li>
//               </ul>
//             </li>
//           </ul>
//         </li>
//         <li class="nav-link"><a href="javascript:void(0)">Sign up</a></li>
//       </ul>
//     </nav>
//   </div>
// </header>
