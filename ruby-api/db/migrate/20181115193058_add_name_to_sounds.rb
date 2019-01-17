class AddNameToSounds < ActiveRecord::Migration[5.2]
  def change
    add_column :sounds, :name, :string
  end
end
