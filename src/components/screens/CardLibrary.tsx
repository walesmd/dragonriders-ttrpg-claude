import { useState } from 'react';
import { RIDERS } from '../../data/riders';
import { DRAGONS } from '../../data/dragons';
import { CARD_DEFINITIONS } from '../../data/cards';
import type { RiderName, DragonName, RiderDefinition, DragonDefinition } from '../../data/types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface CardLibraryProps {
  onBack: () => void;
}

type Tab = 'riders' | 'dragons' | 'cards';
type BackstoryModalContent = {
  type: 'rider' | 'dragon';
  data: RiderDefinition | DragonDefinition;
} | null;

const EFFECT_TYPE_COLORS: Record<string, string> = {
  damage: 'border-red-500 bg-red-900/30',
  burn: 'border-orange-500 bg-orange-900/30',
  freeze: 'border-cyan-500 bg-cyan-900/30',
  shield: 'border-blue-500 bg-blue-900/30',
  heal: 'border-green-500 bg-green-900/30',
  energy: 'border-yellow-500 bg-yellow-900/30',
  drain: 'border-purple-500 bg-purple-900/30',
  discard: 'border-pink-500 bg-pink-900/30',
  chain: 'border-indigo-500 bg-indigo-900/30',
  dual: 'border-violet-500 bg-violet-900/30',
  cripple: 'border-rose-500 bg-rose-900/30',
  thaw: 'border-teal-500 bg-teal-900/30',
  firebreak: 'border-amber-500 bg-amber-900/30',
  strip: 'border-gray-500 bg-gray-900/30',
  energy_shield: 'border-sky-500 bg-sky-900/30',
};

export default function CardLibrary({ onBack }: CardLibraryProps) {
  const [activeTab, setActiveTab] = useState<Tab>('riders');
  const [backstoryModal, setBackstoryModal] = useState<BackstoryModalContent>(null);

  const riderNames = Object.keys(RIDERS) as RiderName[];
  const dragonNames = Object.keys(DRAGONS) as DragonName[];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Card Library</h1>
          <Button onClick={onBack} variant="secondary">
            Back to Menu
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('riders')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'riders'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Riders ({riderNames.length})
          </button>
          <button
            onClick={() => setActiveTab('dragons')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'dragons'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Dragons ({dragonNames.length})
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'cards'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Cards ({CARD_DEFINITIONS.length})
          </button>
        </div>

        {/* Content */}
        <div className="pb-8">
          {activeTab === 'riders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {riderNames.map((name) => {
                const rider = RIDERS[name];
                const gradientClasses = `from-${rider.visualTheme.primary[0]} to-${rider.visualTheme.primary[1]}`;

                return (
                  <div
                    key={name}
                    className={`rounded-xl bg-gradient-to-br ${gradientClasses} overflow-hidden`}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={rider.imagePath}
                        alt={name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">{name}</h3>

                      <div className="flex gap-4 text-sm mb-4">
                        <span className="text-red-300 font-semibold">{rider.maxHp} HP</span>
                        <span className="text-yellow-300 font-semibold">+{rider.baseEconomy} Economy</span>
                      </div>

                      <div className="text-xs text-gray-100 mb-4 italic">
                        "{rider.shortIntro}"
                      </div>

                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-xs font-semibold text-gray-200 mb-1">PASSIVE</div>
                          <div className="text-gray-100">{rider.passive}</div>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-yellow-200/80 mb-1">
                            WOUNDED (≤{rider.woundedThreshold} HP)
                          </div>
                          <div className="text-yellow-100/80">{rider.woundedEffect}</div>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-red-200/80 mb-1">
                            CRITICAL (≤{rider.criticalThreshold} HP)
                          </div>
                          <div className="text-red-100/80">{rider.criticalEffect}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setBackstoryModal({ type: 'rider', data: rider })}
                        className="w-full bg-black/30 hover:bg-black/50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Read Full Story
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'dragons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dragonNames.map((name) => {
                const dragon = DRAGONS[name];
                const gradientClasses = `from-${dragon.visualTheme.primary[0]} to-${dragon.visualTheme.primary[1]}`;

                return (
                  <div
                    key={name}
                    className={`rounded-xl bg-gradient-to-br ${gradientClasses} overflow-hidden`}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={dragon.imagePath}
                        alt={name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">{name}</h3>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <span className="text-green-300 font-semibold">{dragon.maxHp} HP</span>
                        <span className="text-blue-300 font-semibold">{dragon.shields} Shields</span>
                        <span className="text-red-300 font-semibold">{dragon.attackDamage} Damage</span>
                        <span className="text-yellow-300 font-semibold">{dragon.attackCost} Cost</span>
                      </div>

                      <div className="text-xs text-gray-100 mb-4 italic">
                        "{dragon.shortIntro}"
                      </div>

                      <div className="text-sm mb-4">
                        <div className="text-xs font-semibold text-gray-200 mb-1">ABILITY</div>
                        <div className="text-gray-100">{dragon.ability}</div>
                      </div>

                      <button
                        onClick={() => setBackstoryModal({ type: 'dragon', data: dragon })}
                        className="w-full bg-black/30 hover:bg-black/50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Read Full Story
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'cards' && (
            <div>
              {/* Cards grouped by type */}
              {[
                { title: 'Damage', types: ['damage'] },
                { title: 'Burn', types: ['burn'] },
                { title: 'Multi-Target', types: ['chain', 'dual'] },
                { title: 'Control', types: ['freeze', 'cripple'] },
                { title: 'Defense', types: ['shield', 'heal'] },
                { title: 'Economy', types: ['energy', 'drain'] },
                { title: 'Utility', types: ['discard', 'thaw', 'firebreak', 'strip', 'energy_shield'] },
              ].map((category) => {
                const categoryCards = CARD_DEFINITIONS.filter((card) =>
                  category.types.includes(card.effectType)
                );

                if (categoryCards.length === 0) return null;

                return (
                  <div key={category.title} className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">{category.title}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categoryCards.map((card, idx) => (
                        <div
                          key={`${card.name}-${idx}`}
                          className={`p-4 rounded-lg border-2 ${
                            EFFECT_TYPE_COLORS[card.effectType] || 'border-gray-500 bg-gray-800'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-white text-sm flex-1">{card.name}</h3>
                            <div className="bg-yellow-500 text-gray-900 font-bold text-xs px-2 py-1 rounded ml-2">
                              {card.cost}
                            </div>
                          </div>
                          <p className="text-xs text-gray-300 mb-2">{card.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 capitalize">{card.effectType}</span>
                            <span className="text-gray-500">{card.copies}x in pool</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Backstory Modal */}
      {backstoryModal && (
        <Modal
          isOpen={true}
          onClose={() => setBackstoryModal(null)}
          title={backstoryModal.data.name}
        >
          <div className="space-y-4">
            {/* Image */}
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src={backstoryModal.data.imagePath}
                alt={backstoryModal.data.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Short Intro */}
            <div className="text-gray-300 italic text-center">
              "{backstoryModal.data.shortIntro}"
            </div>

            {/* Stats */}
            <div className="flex gap-4 justify-center text-sm">
              {backstoryModal.type === 'rider' ? (
                <>
                  <span className="text-red-300 font-semibold">
                    {(backstoryModal.data as RiderDefinition).maxHp} HP
                  </span>
                  <span className="text-yellow-300 font-semibold">
                    +{(backstoryModal.data as RiderDefinition).baseEconomy} Economy
                  </span>
                </>
              ) : (
                <>
                  <span className="text-green-300 font-semibold">
                    {(backstoryModal.data as DragonDefinition).maxHp} HP
                  </span>
                  <span className="text-blue-300 font-semibold">
                    {(backstoryModal.data as DragonDefinition).shields} Shields
                  </span>
                  <span className="text-red-300 font-semibold">
                    {(backstoryModal.data as DragonDefinition).attackDamage} DMG
                  </span>
                  <span className="text-yellow-300 font-semibold">
                    {(backstoryModal.data as DragonDefinition).attackCost} Cost
                  </span>
                </>
              )}
            </div>

            {/* Backstory */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Backstory</h3>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {backstoryModal.data.backstory}
              </div>
            </div>

            {/* Character Details */}
            {backstoryModal.type === 'rider' && (
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-1">PASSIVE</div>
                  <div className="text-gray-200">
                    {(backstoryModal.data as RiderDefinition).passive}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-yellow-300 mb-1">
                    WOUNDED (≤{(backstoryModal.data as RiderDefinition).woundedThreshold} HP)
                  </div>
                  <div className="text-gray-200">
                    {(backstoryModal.data as RiderDefinition).woundedEffect}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-red-300 mb-1">
                    CRITICAL (≤{(backstoryModal.data as RiderDefinition).criticalThreshold} HP)
                  </div>
                  <div className="text-gray-200">
                    {(backstoryModal.data as RiderDefinition).criticalEffect}
                  </div>
                </div>
              </div>
            )}

            {backstoryModal.type === 'dragon' && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-xs font-semibold text-gray-400 mb-1">ABILITY</div>
                <div className="text-gray-200">
                  {(backstoryModal.data as DragonDefinition).ability}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
