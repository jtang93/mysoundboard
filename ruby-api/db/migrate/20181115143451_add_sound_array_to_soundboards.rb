class AddSoundArrayToSoundboards < ActiveRecord::Migration[5.2]
  def change
    add_column :soundboards, :array, :string, array: true, default:[]
  end
end
