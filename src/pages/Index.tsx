import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ChefHat, UtensilsCrossed } from 'lucide-react';
import { useApp, UserRole } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const roles = [
  {
    id: 'admin' as UserRole,
    title: 'Administrator',
    description: 'Full access to manage menu, inventory, and view reports',
    icon: ShieldCheck,
    color: 'from-primary to-primary/80',
  },
  {
    id: 'waiter' as UserRole,
    title: 'Waiter',
    description: 'Take orders, manage tables, and process billing',
    icon: User,
    color: 'from-info to-info/80',
  },
  {
    id: 'chef' as UserRole,
    title: 'Chef',
    description: 'View kitchen orders and update preparation status',
    icon: ChefHat,
    color: 'from-warning to-warning/80',
  },
];

export default function Index() {
  const { setUserRole } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = ( role: UserRole ) => {
    setUserRole( role );
    navigate( `/${ role }` );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Pattern */ }
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo & Header */ }
        <motion.div
          initial={ { opacity: 0, y: -20 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.5 } }
          className="mb-12 text-center"
        >
          <motion.div
            initial={ { scale: 0 } }
            animate={ { scale: 1 } }
            transition={ { type: 'spring', stiffness: 200, delay: 0.2 } }
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg"
          >
            <UtensilsCrossed className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
            RestaurantOS
          </h1>
          <p className="text-lg text-muted-foreground">
            Modern Restaurant Management System
          </p>
        </motion.div>

        {/* Role Selection */ }
        <motion.div
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          transition={ { delay: 0.3 } }
          className="w-full max-w-7xl"
        >
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            Select your role to continue
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            { roles.map( ( role, index ) => (
              <motion.div
                key={ role.id }
                initial={ { opacity: 0, y: 20 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { delay: 0.4 + index * 0.1 } }
              >
                <Button
                  variant="outline"
                  className="group overflow-hidden h-auto w-full flex-col items-center gap-4 rounded-2xl border-2 border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:bg-primary-light hover:shadow-lg px-5"
                  onClick={ () => handleRoleSelect( role.id ) }
                >
                  <div
                    className={ `flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${ role.color } shadow-sm transition-transform group-hover:scale-110` }
                  >
                    <role.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="text-center w-full whitespace-normal">
                    <h3 className="mb-1 text-lg font-semibold text-foreground">
                      { role.title }
                    </h3>
                    <p className="text-sm text-muted-foreground ">
                      { role.description }
                    </p>
                  </div>
                </Button>
              </motion.div>
            ) ) }
          </div>
        </motion.div>

        {/* Footer */ }
        <motion.p
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          transition={ { delay: 0.8 } }
          className="mt-12 text-xs text-muted-foreground"
        >
          Demo Mode — No authentication required
        </motion.p>
      </div>
    </div>
  );
}
