"""W28 compact table study from the exact W26c source; no canonical overwrite."""
import bpy,os,json,hashlib
from pathlib import Path
from mathutils import Matrix,Vector
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
src=Path(os.environ["HOREB_W26C_INPUT"]);out=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
assert not out.exists();out.mkdir(parents=True)
m=json.loads((src/"w26-study-manifest.json").read_text(encoding="utf8"))
blend=src/"w26c-house-study.blend";assert sha(blend)==m["blend_sha256"]
assert sha(src/m["glb_file"])==m["glb_sha256"]=="34c1cdc2f005d41f23d0f8c631997ae8029f5536e16066139c422bce5caa234e"
bpy.ops.wm.open_mainfile(filepath=str(blend),load_ui=False)
scene=bpy.context.scene
def bounds(o):
 obj=o.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh()
 vs=[obj.matrix_world@v.co for v in me.vertices];obj.to_mesh_clear()
 return [[min(v[k] for v in vs) for k in range(3)],[max(v[k] for v in vs) for k in range(3)]]
table=bpy.data.objects["Coarse_work_surface"];base=bpy.data.objects["Basket_W26_closed_woven_base"]
before=bounds(table);basket_before=bounds(base)
assert abs(before[0][0]+.475)<.001 and abs(before[1][0]-1.195)<.001
scale=1.2/1.67
matrix=Matrix.Translation(Vector((-.005+.475*scale,0,0)))@Matrix.Diagonal((scale,1,1,1))
table.matrix_world=matrix@table.matrix_world
supports=[o for o in scene.objects if o.name.startswith("Workshop_wood_support") and o.type=="MESH"]
assert len(supports)==4
moved=[]
for o in supports:
 if bounds(o)[1][0]<0:
  mat=o.matrix_world.copy();mat.translation.x+=.39;o.matrix_world=mat;moved.append(o.name)
assert len(moved)==2
bpy.context.view_layer.update()
after=bounds(table);basket_after=bounds(base)
assert basket_before==basket_after
assert abs(after[0][0]+.005)<.001 and abs(after[1][0]-1.195)<.001
assert basket_after[0][0]-after[0][0]>.039
assert after[1][0]-basket_after[1][0]>.5
for o in supports:
 b=bounds(o)
 assert b[0][0]>after[0][0] and b[1][0]<after[1][0]
rim=bpy.data.objects["Basket_thick_lipped_rim"]
assert hashlib.sha256(repr([(round(v.co.x,6),round(v.co.y,6),round(v.co.z,6)) for v in rim.data.vertices]).encode()).hexdigest()==m["rim_vertex_hash"]
bpy.ops.file.pack_all();bpy.context.preferences.filepaths.save_version=0
candidate=out/"w28-house.blend";bpy.ops.wm.save_as_mainfile(filepath=str(candidate),check_existing=False)
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:o.select_set(o.type in ("MESH","EMPTY"))
bpy.context.view_layer.objects.active=bpy.data.objects["HOREB_HOUSE_01__RECONSTRUCTION_NOT_ATTESTED"]
export=out/"w28-house.glb"
bpy.ops.export_scene.gltf(filepath=str(export),export_format="GLB",export_yup=True,export_apply=True,export_animations=False,use_selection=True,export_materials="EXPORT")
record={"status":"ART_HOLD_W28_COMPACT_HOUSE","source_sha256":sha(blend),"baseline_glb_sha256":m["glb_sha256"],"blend_sha256":sha(candidate),"glb_sha256":sha(export),"bytes":export.stat().st_size,"table_before":before,"table_after":after,"basket_base":basket_after,"moved_supports":moved,"rim_vertex_hash":m["rim_vertex_hash"]}
(out/"w28-house-manifest.json").write_text(json.dumps(record,indent=2),encoding="utf8")
print("W28_HOUSE_EXPORTED",json.dumps(record),flush=True)
