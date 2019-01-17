class CreateSoundboardSounds < ActiveRecord::Migration[5.2]
  def change
    create_table :soundboard_sounds do |t|
      t.integer :soundboard_id
      t.integer :sound_id

      t.timestamps
    end
  end
end
