import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // ໃສ່ຊື່ບໍລິສັດ ຫຼື ແອັບພລິເຄຊັນຂອງທ່ານຢູ່ບ່ອນນີ້
  const companyName = "AccountingDoc Pro"; 

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Section 1: Brand & Mission */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">LOGO</h2>
            <p className="text-sm text-gray-400 font-phetsarath">
              ລະບົບຈັດການເອກະສານບັນຊີທີ່ປອດໄພ ແລະ ມີປະສິດທິພາບ
              ເພື່ອຊ່ວຍໃຫ້ທຸລະກິດຂອງທ່ານເຕີບໂຕຢ່າງໝັ້ນຄົງ.
            </p>
          </div>

          {/* Section 2: Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase font-phetsarath">ຜະລິດຕະພັນ</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/features" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ຄຸນສົມບັດ</Link></li>
              <li><Link to="/security" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ຄວາມປອດໄພ</Link></li>
              <li><Link to="/pricing" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ແພັກເກດລາຄາ</Link></li>
            </ul>
          </div>

          {/* Section 3: Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase font-phetsarath">ບໍລິສັດ</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ກ່ຽວກັບພວກເຮົາ</Link></li>
              <li><Link to="/contact" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ຕິດຕໍ່ພວກເຮົາ</Link></li>
              <li><Link to="/careers" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ຮ່ວມງານກັບພວກເຮົາ</Link></li>
            </ul>
          </div>

          {/* Section 4: Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase font-phetsarath">ດ້ານກົດໝາຍ</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/privacy" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ</Link></li>
              <li><Link to="/terms" className="text-base text-gray-400 hover:text-white transition-colors font-phetsarath">ເງື່ອນໄຂການນຳໃຊ້</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center sm:text-left font-phetsarath">
            &copy; {currentYear} {companyName}. ສະຫງວນລິຂະສິດ.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only font-phetsarath">Facebook</span>
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only font-phetsarath">Twitter</span>
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only font-phetsarath">LinkedIn</span>
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;